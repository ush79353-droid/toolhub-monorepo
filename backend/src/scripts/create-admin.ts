import readline from 'node:readline';
import { connectDB, disconnectDB } from '../config/database';
import { AdminUser } from '../modules/admins/admin-user.model';
import { hashPassword, MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '../utils/password';
import { logger } from '../utils/logger';

function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

function askHiddenQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(query);

    const stdin = process.stdin;
    const isTTY = Boolean(stdin.isTTY);

    if (!isTTY) {
      // In non-interactive CI or pipe mode, read line directly
      const rl = readline.createInterface({ input: stdin, output: process.stdout });
      rl.question('', (ans) => {
        rl.close();
        resolve(ans.trim());
      });
      return;
    }

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');

    let password = '';
    const onData = (char: string) => {
      // Enter key
      if (char === '\n' || char === '\r' || char === '\u0004') {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.removeListener('data', onData);
        process.stdout.write('\n');
        resolve(password.trim());
      } else if (char === '\u0003') {
        // Ctrl+C
        process.stdout.write('\nAborted.\n');
        process.exit(1);
      } else if (char === '\u0008' || char === '\x7f') {
        // Backspace
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write('\b \b');
        }
      } else {
        password += char;
        process.stdout.write('*');
      }
    };

    stdin.on('data', onData);
  });
}

async function run() {
  console.log('\n=============================================');
  console.log('   MEGA TOOLS — Super Admin Bootstrap CLI    ');
  console.log('=============================================\n');

  const connected = await connectDB();
  if (!connected) {
    logger.error('Failed to connect to MongoDB. Ensure your database is running.');
    process.exit(1);
  }

  try {
    const envName = process.env.BOOTSTRAP_ADMIN_NAME;
    const envEmail = process.env.BOOTSTRAP_ADMIN_EMAIL;
    const envPass = process.env.BOOTSTRAP_ADMIN_PASSWORD;

    const name = envName || (await askQuestion('Enter Full Name (e.g. System Administrator): '));
    if (!name || name.length < 2) {
      console.error('❌ Error: Name must be at least 2 characters.');
      process.exit(1);
    }

    const email = (envEmail || (await askQuestion('Enter Admin Email Address: ')))
      .toLowerCase()
      .trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.error('❌ Error: Invalid email format.');
      process.exit(1);
    }

    // Check if account already exists
    const existing = await AdminUser.findOne({ email });
    if (existing) {
      console.error(
        `\n❌ Error: An administrator account with email '${email}' already exists (Role: ${existing.role}, Status: ${existing.status}). Duplicate registration prevented.\n`
      );
      process.exit(1);
    }

    let password = envPass;
    if (!password) {
      password = await askHiddenQuestion('Enter Password (min 8 chars, hidden input): ');
      const confirmPassword = await askHiddenQuestion('Confirm Password: ');

      if (password !== confirmPassword) {
        console.error('❌ Error: Passwords do not match.');
        process.exit(1);
      }
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      console.error(`❌ Error: Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      process.exit(1);
    }

    if (password.length > MAX_PASSWORD_LENGTH) {
      console.error(`❌ Error: Password cannot exceed ${MAX_PASSWORD_LENGTH} characters.`);
      process.exit(1);
    }

    console.log('\n⏳ Hashing password with Argon2id and provisioning account...');
    const passwordHash = await hashPassword(password);

    const newAdmin = await AdminUser.create({
      name,
      email,
      passwordHash,
      role: 'super_admin',
      status: 'active',
      failedLoginAttempts: 0,
    });

    console.log('\n✅ Super Admin account created successfully:');
    console.log(`   - ID:     ${newAdmin._id}`);
    console.log(`   - Name:   ${newAdmin.name}`);
    console.log(`   - Email:  ${newAdmin.email}`);
    console.log(`   - Role:   ${newAdmin.role}`);
    console.log(`   - Status: ${newAdmin.status}`);
    console.log('\nYou may now sign in at http://localhost:3000/admin/login\n');
  } catch (error) {
    logger.error('Error creating super admin', error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}

run();
