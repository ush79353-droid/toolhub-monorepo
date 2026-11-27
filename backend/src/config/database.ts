import dns from 'dns';
import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export type DbConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'disconnecting';

/** Process-local resolvers that successfully answer Atlas SRV when Node's default path returns EBADRESP. */
const FALLBACK_DNS_SERVERS = ['9.9.9.9', '149.112.112.112', '1.1.1.1'];

let listenersAttached = false;

export function getDatabaseStatus(): {
  status: DbConnectionStatus;
  name?: string;
  host?: string;
} {
  const readyState = mongoose.connection.readyState;
  const statusMap: Record<number, DbConnectionStatus> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const status = statusMap[readyState] ?? 'disconnected';
  const name = mongoose.connection.name;
  const host = mongoose.connection.host;

  return { status, name, host };
}

function redactMongoUri(uri: string): string {
  return uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
}

function isSrvDnsFailure(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes('querySrv') ||
    message.includes('EBADRESP') ||
    message.includes('ENOTFOUND') ||
    message.includes('ECONNREFUSED')
  );
}

/**
 * Build a direct mongodb:// seedlist URI from mongodb+srv using process-local DNS.
 * Does not change machine-wide DNS. Returns null when URI is not +srv or resolution fails.
 */
export async function resolveMongodbSrvToDirectUri(
  srvUri: string,
): Promise<string | null> {
  if (!srvUri.startsWith('mongodb+srv://')) {
    return null;
  }

  const match = srvUri.match(
    /^mongodb\+srv:\/\/([^@]+)@([^/?]+)(?:\/([^?]*))?(?:\?(.*))?$/,
  );
  if (!match) {
    return null;
  }

  const [, credentials, host, dbPath = '', query = ''] = match;
  const resolver = new dns.Resolver();
  resolver.setServers(FALLBACK_DNS_SERVERS);

  const srvRecords = await new Promise<dns.SrvRecord[]>((resolve, reject) => {
    resolver.resolveSrv(`_mongodb._tcp.${host}`, (err, addresses) => {
      if (err) reject(err);
      else resolve(addresses);
    });
  });

  if (!srvRecords.length) {
    return null;
  }

  let replicaSet = '';
  let authSource = 'admin';
  try {
    const txtRecords = await new Promise<string[][]>((resolve, reject) => {
      resolver.resolveTxt(host, (err, records) => {
        if (err) reject(err);
        else resolve(records);
      });
    });
    const txt = txtRecords.map((parts) => parts.join('')).join('');
    const txtParams = new URLSearchParams(txt);
    replicaSet = txtParams.get('replicaSet') ?? '';
    authSource = txtParams.get('authSource') ?? 'admin';
  } catch {
    // TXT optional if query string already carries replicaSet/authSource
  }

  const hosts = srvRecords
    .map((record) => `${record.name}:${record.port || 27017}`)
    .join(',');
  const params = new URLSearchParams(query);
  params.set('tls', 'true');
  if (replicaSet && !params.has('replicaSet')) {
    params.set('replicaSet', replicaSet);
  }
  if (!params.has('authSource')) {
    params.set('authSource', authSource);
  }

  return `mongodb://${credentials}@${hosts}/${dbPath}?${params.toString()}`;
}

function attachConnectionListeners(): void {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on('connected', () => {
    logger.info('MongoDB connected successfully', {
      db: mongoose.connection.name,
    });
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB runtime connection error', err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB disconnected');
  });
}

export async function connectDB(): Promise<boolean> {
  try {
    mongoose.set('strictQuery', true);
    attachConnectionListeners();

    const options = { serverSelectionTimeoutMS: 20000 };

    try {
      await mongoose.connect(env.MONGODB_URI, options);
      return true;
    } catch (primaryError) {
      if (!isSrvDnsFailure(primaryError)) {
        throw primaryError;
      }

      logger.warn(
        'MongoDB mongodb+srv DNS failed; retrying with process-local SRV seedlist',
        {
          message:
            primaryError instanceof Error
              ? primaryError.message
              : String(primaryError),
        },
      );

      const directUri = await resolveMongodbSrvToDirectUri(env.MONGODB_URI);
      if (!directUri) {
        throw primaryError;
      }

      await mongoose.connect(directUri, options);
      logger.info('MongoDB connected via direct seedlist fallback', {
        uri: redactMongoUri(directUri),
      });
      return true;
    }
  } catch (error) {
    logger.error('Failed to establish initial MongoDB connection', error, {
      uri: redactMongoUri(env.MONGODB_URI),
    });
    return false;
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      logger.info('MongoDB disconnected cleanly during shutdown');
    }
  } catch (error) {
    logger.error('Error during MongoDB disconnection', error);
  }
}
