// Integration tests for admin routes
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../../server'); // Adjust path as needed
const { getAuthHeaders } = require('../../helpers/testHelpers');

describe('Admin Routes Integration Tests', () => {
  let authHeaders;

  beforeAll(() => {
    authHeaders = getAuthHeaders('admin');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('GET /admin/categories', () => {
    it('should return categories for authenticated admin', async () => {
      const response = await request(app)
        .get('/admin/categories')
        .set(authHeaders);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('categories');
      expect(Array.isArray(response.body.categories)).toBe(true);
    });

    it('should return 401 for unauthorized access', async () => {
      const response = await request(app)
        .get('/admin/categories');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /admin/categories', () => {
    it('should create a new category', async () => {
      const newCategory = {
        name: 'Test Category',
        slug: 'test-category',
        description: 'Test category description'
      };

      const response = await request(app)
        .post('/admin/categories')
        .set(authHeaders)
        .send(newCategory);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('category');
      expect(response.body.category.name).toBe(newCategory.name);
    });

    it('should return 400 for invalid category data', async () => {
      const invalidCategory = {
        name: '', // Empty name should fail validation
        slug: 'test-category'
      };

      const response = await request(app)
        .post('/admin/categories')
        .set(authHeaders)
        .send(invalidCategory);

      expect(response.status).toBe(400);
    });
  });
});
