// Unit tests for Category model
const Category = require('../../../models/master/categoryModel');
const mongoose = require('mongoose');

describe('Category Model', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/admin_panel_test');
    }
  });

  afterEach(async () => {
    await Category.deleteMany({});

  });

  describe('Validation', () => {
    it('should create a valid category', async () => {
      const categoryData = {
        name: 'Test Category',
        slug: 'test-category',
        description: 'Test category description',
        isActive: true
      };

      const category = new Category(categoryData);
      const savedCategory = await category.save();

      expect(savedCategory._id).toBeDefined();
      expect(savedCategory.name).toBe(categoryData.name);
      expect(savedCategory.slug).toBe(categoryData.slug);
      expect(savedCategory.createdAt).toBeDefined();
      expect(savedCategory.updatedAt).toBeDefined();
    });

    it('should require name field', async () => {
      const category = new Category({
        slug: 'test-category',
        description: 'Test description'
      });

      await expect(category.save()).rejects.toThrow(mongoose.Error.ValidationError);
    });

    it('should require unique slug', async () => {
      const category1 = new Category({
        name: 'Category 1',
        slug: 'unique-slug',
        description: 'First category'
      });
      await category1.save();

      const category2 = new Category({
        name: 'Category 2',
        slug: 'unique-slug',
        description: 'Second category'
      });

      await expect(category2.save()).rejects.toThrow();
    });

    it('should set isActive to true by default', async () => {
      const category = new Category({
        name: 'Test Category',
        slug: 'test-category'
      });

      const savedCategory = await category.save();
      expect(savedCategory.isActive).toBe(true);
    });
  });

  describe('Methods', () => {
    it('should correctly format category response', async () => {
      const category = new Category({
        name: 'Test Category',
        slug: 'test-category',
        description: 'Test description'
      });

      const savedCategory = await category.save();
      const response = savedCategory.toObject();

      expect(response).toHaveProperty('_id');
      expect(response).toHaveProperty('name');
      expect(response).toHaveProperty('slug');
      expect(response).toHaveProperty('createdAt');
      expect(response).toHaveProperty('updatedAt');
      expect(response.__v).toBeUndefined(); 
    });
  });
});
