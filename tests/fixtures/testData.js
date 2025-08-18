const mongoose = require('mongoose');

const testUsers = [
  {
    _id: new mongoose.Types.ObjectId(),
    username: 'admin@test.com',
    email: 'admin@test.com',
    password: '$2b$10$exampleHashedPassword',
    role: 'admin',
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId(),
    username: 'user@test.com',
    email: 'user@test.com',
    password: '$2b$10$exampleHashedPassword',
    role: 'user',
    isActive: true
  }
];

const testCategories = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and accessories',
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Clothing',
    slug: 'clothing',
    description: 'Apparel and fashion items',
    isActive: true
  }
];

const testProducts = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test Smartphone',
    slug: 'test-smartphone',
    description: 'A test smartphone for testing',
    price: 299.99,
    category: testCategories[0]._id,
    brand: new mongoose.Types.ObjectId(),
    isActive: true,
    stock: 50
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test T-Shirt',
    slug: 'test-t-shirt',
    description: 'A test t-shirt for testing',
    price: 19.99,
    category: testCategories[1]._id,
    brand: new mongoose.Types.ObjectId(),
    isActive: true,
    stock: 100
  }
];

const testStores = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test Store 1',
    slug: 'test-store-1',
    description: 'First test store',
    isActive: true
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'Test Store 2',
    slug: 'test-store-2',
    description: 'Second test store',
    isActive: true
  }
];

// Sample brand data
const testBrands = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: 'TestBrand',
    slug: 'testbrand',
    description: 'Test brand for testing',
    isActive: true
  }
];

module.exports = {
  testUsers,
  testCategories,
  testProducts,
  testStores,
  testBrands
};
