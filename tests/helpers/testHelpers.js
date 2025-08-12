// Testing utilities and helper functions
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

/**
 * Generate a test JWT token
 * @param {Object} payload - Token payload
 * @param {String} role - User role
 * @returns {String} JWT token
 */
const generateTestToken = (payload = {}, role = 'user') => {
  const defaultPayload = {
    userId: new mongoose.Types.ObjectId().toString(),
    email: 'test@example.com',
    role
  };
  
  return jwt.sign(
    { ...defaultPayload, ...payload },
    process.env.JWT_SECRET || 'test-secret-key',
    { expiresIn: '1h' }
  );
};

/**
 * Create authenticated request headers
 * @param {String} role - User role
 * @returns {Object} Headers object with authorization
 */
const getAuthHeaders = (role = 'user') => {
  const token = generateTestToken({}, role);
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Clean up database collections
 * @param {Array} models - Array of Mongoose models to clean
 */
const cleanDatabase = async (models = []) => {
  for (const model of models) {
    await model.deleteMany({});
  }
};

/**
 * Create test database connection
 * @returns {Promise<Object>} Database connection
 */
const createTestDatabase = async () => {
  const mongoUri = process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/admin_panel_test';
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  return mongoose.connection;
};

/**
 * Close test database connection
 */
const closeTestDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

/**
 * Validate API response structure
 * @param {Object} response - API response
 * @param {Object} expected - Expected response structure
 */
const validateApiResponse = (response, expected = {}) => {
  expect(response).toHaveProperty('status');
  expect(response).toHaveProperty('body');
  
  if (expected.data) {
    expect(response.body).toMatchObject(expected.data);
  }
  
  if (expected.statusCode) {
    expect(response.status).toBe(expected.statusCode);
  }
};

module.exports = {
  generateTestToken,
  getAuthHeaders,
  cleanDatabase,
  createTestDatabase,
  closeTestDatabase,
  validateApiResponse
};
