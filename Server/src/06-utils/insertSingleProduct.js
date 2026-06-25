import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../01-config/db.js';
import Product from '../02-models/Product.js';

// Setup __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Inserts a single test product with a recognizable name and current timestamp.
 */
const insertTestProduct = async () => {
  try {
    await connectDB();

    // Create a new product instance
    const testProduct = new Product({
      name: `## INTERVIEW TEST PRODUCT ## (${new Date().toLocaleTimeString()})`,
      category: 'Books',
      price: 99.99
    });

    const savedProduct = await testProduct.save();
    
    console.log('\n==================================================');
    console.log('🎉 SUCCESS: Inserted 1 New Test Product!');
    console.log(`ID:        ${savedProduct._id}`);
    console.log(`Name:      ${savedProduct.name}`);
    console.log(`Category:  ${savedProduct.category}`);
    console.log(`Price:     $${savedProduct.price}`);
    console.log(`updatedAt: ${savedProduct.updatedAt.toISOString()}`);
    console.log('==================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Failed to insert test product:', error);
    process.exit(1);
  }
};

insertTestProduct();
