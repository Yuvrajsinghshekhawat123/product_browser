const categories = [
  'Electronics',
  'Books',
  'Shoes',
  'Clothing',
  'Sports',
  'Beauty',
  'Kitchen',
  'Furniture',
  'Home',
  'Toys'
];

const adjectives = [
  'Premium', 'Luxury', 'Classic', 'Modern', 'Eco-Friendly', 
  'Minimalist', 'Compact', 'Durable', 'Sleek', 'Vintage', 
  'Advanced', 'Smart', 'Ergonomic', 'Handcrafted', 'Waterproof'
];

const nouns = {
  Electronics: ['Smartphone', 'Headphones', 'Laptop', 'Smartwatch', 'Speaker', 'Tablet', 'Camera', 'Keyboard', 'Monitor', 'Charger'],
  Books: ['Novel', 'Biography', 'Thriller', 'Sci-Fi Book', 'Cookbook', 'History Book', 'Comic', 'Poetry Collection', 'Encyclopedia', 'Guidebook'],
  Shoes: ['Sneakers', 'Boots', 'Running Shoes', 'Sandals', 'Loafers', 'Heels', 'Slippers', 'Oxford Shoes', 'Slippers', 'Clogs'],
  Clothing: ['T-Shirt', 'Jeans', 'Jacket', 'Hoodie', 'Dress', 'Sweater', 'Socks', 'Shorts', 'Coat', 'Scarf'],
  Sports: ['Basketball', 'Yoga Mat', 'Dumbbells', 'Racket', 'Running Jacket', 'Water Bottle', 'Grip Tape', 'Gym Bag', 'Helmet', 'Gloves'],
  Beauty: ['Lipstick', 'Moisturizer', 'Perfume', 'Shampoo', 'Face Mask', 'Eye Cream', 'Hair Dryer', 'Sunscreen', 'Serum', 'Lip Balm'],
  Kitchen: ['Blender', 'Coffee Maker', 'Toaster', 'Pan', 'Knife Set', 'Cutting Board', 'Kettle', 'Measuring Cups', 'Spatula', 'Air Fryer'],
  Furniture: ['Chair', 'Sofa', 'Dining Table', 'Desk', 'Bookshelf', 'Bed Frame', 'Nightstand', 'Wardrobe', 'Cabinet', 'Bench'],
  Home: ['Lamp', 'Rug', 'Vase', 'Curtains', 'Wall Clock', 'Throw Pillow', 'Blanket', 'Mirror', 'Candle', 'Organizer'],
  Toys: ['Action Figure', 'Puzzle', 'Board Game', 'Doll', 'Building Blocks', 'Toy Car', 'Plush Bear', 'Yo-Yo', 'Kite', 'Train Set']
};

/**
 * Generate a single product object with realistic name, category, price, and timestamps
 */
export const generateProduct = () => {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const categoryNouns = nouns[category];
  const noun = categoryNouns[Math.floor(Math.random() * categoryNouns.length)];
  
  // Format: "Premium Smartphone 482"
  const name = `${adj} ${noun} ${Math.floor(Math.random() * 1000)}`;
  const price = parseFloat((Math.random() * (1000 - 5) + 5).toFixed(2));
  
  // Random timestamp creation (within the past 365 days)
  const now = new Date();
  const pastYearMs = 365 * 24 * 60 * 60 * 1000;
  const createdAtMs = now.getTime() - Math.floor(Math.random() * pastYearMs);
  const createdAt = new Date(createdAtMs);
  
  // updatedAt must be greater than or equal to createdAt. 
  // Add a random delay up to 30 days, capped at the current time.
  const maxUpdateDiffMs = 30 * 24 * 60 * 60 * 1000;
  const updateDiffMs = Math.floor(Math.random() * maxUpdateDiffMs);
  const updatedAtMs = Math.min(now.getTime(), createdAtMs + updateDiffMs);
  const updatedAt = new Date(updatedAtMs);
  
  return {
    name,
    category,
    price,
    createdAt,
    updatedAt
  };
};
