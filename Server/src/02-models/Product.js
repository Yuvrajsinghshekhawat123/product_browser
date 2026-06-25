import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt
  }
);

// Define compound indexes to optimize queries and cursor pagination
// Index 1: Sorted by updatedAt descending, then _id descending (for global paginated queries)
productSchema.index({ updatedAt: -1, _id: -1 });

// Index 2: By category ascending (for simple category queries)
productSchema.index({ category: 1 });

// Index 3: By category, then sorted by updatedAt descending and _id descending (for filtered paginated queries)
productSchema.index({ category: 1, updatedAt: -1, _id: -1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
