import { connectDB, disconnectDB } from '../config/database';
import { fetchAndSaveCurrencyRates } from '../modules/currency/fetch-currency-rates';

async function main(): Promise<void> {
  const connected = await connectDB();
  if (!connected) throw new Error('Failed to connect to MongoDB.');
  try {
    const saved = await fetchAndSaveCurrencyRates();
    console.log(`Saved ${saved} currency rates.`);
  } finally {
    await disconnectDB();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
