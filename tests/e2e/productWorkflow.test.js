// End-to-end tests for complete product workflow
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const { getAuthHeaders } = require('../helpers/testHelpers');
const { testCategories, testBrands, testProducts } = require('../fixtures/testData');

describe('Product Workflow E2E Tests', () => {
  let authHeaders;
  let createdCategory;
  let createdBrand;
  let createdProduct;

  beforeAll(() => {
    authHeaders = getAuthHeaders('admin');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Complete Product Creation Workflow', () => {
    it('should create category, brand, and product in sequence', async () => {
      const categoryResponse = await request(app)
        .post('/admin/categories')
        .set(authHeaders)
        .send({
          name: 'E2E Test Category',
          slug: 'e2e-test-category',
          description: 'Category created for E2E testing'
        });

      expect(categoryResponse.status).toBe(201);
      createdCategory = categoryResponse.body.category;

      const brandResponse = await request(app)
        .post('/admin/brands')
        .set(authHeaders)
        .send({
          name: 'E2E Test Brand',
          slug: 'e2e-test-brand',
          description: 'Brand created for E2E testing'
        });

      expect(brandResponse.status).toBe(201);
      createdBrand = brandResponse.body.brand;

      const productResponse = await request(app)
        .post('/admin/products')
        .set(authHeaders)
        .send({
          name: 'E2E Test Product',
          slug: 'e2e-test-product',
          description: 'Product created for E2E testing',
          price: 99.99,
          category: createdCategory._id,
          brand: createdBrand._id,
          stock: 25
        });

      expect(productResponse.status).toBe(201);
      createdProduct = productResponse.body.product;

      const getProductResponse = await request(app)
        .get(`/admin/products/${createdProduct._id}`)
        .set(authHeaders);

      expect(getProductResponse.status).toBe(200);
      expect(getProductResponse.body.product.name).toBe('E2E Test Product');
    });

    it('should handle product search and filtering', async () => {
      const searchResponse = await request(app)
        .get('/admin/products')
        .set(authHeaders)
        .query({
          search: 'E2E Test Product',
          category: createdCategory._id
        });

      expect(searchResponse.status).toBe(200);
      expect(searchResponse.body.products).toHaveLength(1);
      expect(searchResponse.body.products[0].name).toBe('E2E Test Product');
    });

    it('should update product stock correctly', async () => {
      const updateResponse = await request(app)
        .put(`/admin/products/${createdProduct._id}`)
        .set(authHeaders)
        .send({
          stock: 50
        });

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.product.stock).toBe(50);
    });

    it('should handle product deletion', async () => {
      const deleteResponse = await request(app)
        .delete(`/admin/products/${createdProduct._id}`)
        .set(authHeaders);

      expect(deleteResponse.status).toBe(200);

      const getResponse = await request(app)
        .get(`/admin/products/${createdProduct._id}`)
        .set(authHeaders);

      expect(getResponse.status).toBe(404);
    });
  });
});
