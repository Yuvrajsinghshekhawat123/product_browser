import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../01-config/db.js';
import Product from '../02-models/Product.js';
import { generateProduct } from './generateProduct.js';

// Setup __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from Server root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const SEED_COUNT = 200000;
const BATCH_SIZE = 5000;

/**
 * Run seeding process
 */
const seedDatabase = async () => {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. Drop existing collection to start fresh
    console.log('Clearing existing products in database...');
    await Product.deleteMany({});
    console.log('Collection cleared.');

    const startTime = Date.now();
    let currentBatch = [];
    
    console.log(`Starting seed process for ${SEED_COUNT} products...`);

    // 3. Loop and bulk insert in batches of 5,000
    for (let i = 1; i <= SEED_COUNT; i++) {
      currentBatch.push(generateProduct());

      if (currentBatch.length === BATCH_SIZE) {
        await Product.insertMany(currentBatch, { ordered: false });
        console.log(`Progress: Seeded ${i} / ${SEED_COUNT} products (${((i / SEED_COUNT) * 100).toFixed(1)}%)`);
        currentBatch = [];
      }
    }

    // Insert residual records if any
    if (currentBatch.length > 0) {
      await Product.insertMany(currentBatch, { ordered: false });
    }

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`\nSuccess! Seeded ${SEED_COUNT} products in ${duration} seconds.`);
    
    // 4. Build/Verify indexes
    console.log('Ensuring database indexes are synced...');
    await Product.syncIndexes();
    console.log('All indexes built and verified successfully.');

    process.exit(0);
  } catch (error) {
    console.error('Seeding script failed with error:', error);
    process.exit(1);
  }
};

seedDatabase();
