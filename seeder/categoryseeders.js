// const mongoose = require('mongoose');
// const subcategoryModel = require('../models/master/subcategoryModel');
// const categoryModel = require('../models/master/categoryModel');

// const categoriesData = [
//   {
//     category_name: "Electronics",
//     category_description: "Latest electronic gadgets and devices",
//     image_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500",
//     is_active: true,
//     subcategories: [
//       {
//         subcategory_name: "Smartphones",
//         subcategory_description: "Latest smartphones and mobile devices",
//         image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
//       },
//       {
//         subcategory_name: "Laptops",
//         subcategory_description: "Gaming and business laptops",
//         image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
//       },
//       {
//         subcategory_name: "Headphones",
//         subcategory_description: "Wireless and wired headphones",
//         image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
//       },
//       {
//         subcategory_name: "Cameras",
//         subcategory_description: "Digital cameras and accessories",
//         image_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500"
//       }
//     ]
//   },
//   {
//     category_name: "Fashion",
//     category_description: "Trendy clothing and accessories",
//     image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500",
//     is_active: true,
//     subcategories: [
//       {
//         subcategory_name: "Men's Clothing",
//         subcategory_description: "Shirts, pants, and men's fashion",
//         image_url: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500"
//       },
//       {
//         subcategory_name: "Women's Clothing",
//         subcategory_description: "Dresses, tops, and women's fashion",
//         image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500"
//       },
//       {
//         subcategory_name: "Shoes",
//         subcategory_description: "Sneakers, formal shoes, and footwear",
//         image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"
//       },
//       {
//         subcategory_name: "Accessories",
//         subcategory_description: "Watches, bags, and fashion accessories",
//         image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
//       }
//     ]
//   },
//   {
//     category_name: "Home & Garden",
//     category_description: "Furniture and home improvement items",
//     image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
//     is_active: true,
//     subcategories: [
//       {
//         subcategory_name: "Furniture",
//         subcategory_description: "Sofas, chairs, and home furniture",
//         image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"
//       },
//       {
//         subcategory_name: "Kitchen Appliances",
//         subcategory_description: "Refrigerators, microwaves, and kitchen tools",
//         image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
//       },
//       {
//         subcategory_name: "Garden Tools",
//         subcategory_description: "Gardening equipment and outdoor tools",
//         image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500"
//       },
//       {
//         subcategory_name: "Home Decor",
//         subcategory_description: "Wall art, lighting, and decorative items",
//         image_url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500"
//       }
//     ]
//   },
//   {
//     category_name: "Sports & Fitness",
//     category_description: "Sports equipment and fitness gear",
//     image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
//     is_active: true,
//     subcategories: [
//       {
//         subcategory_name: "Gym Equipment",
//         subcategory_description: "Weights, treadmills, and fitness machines",
//         image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500"
//       },
//       {
//         subcategory_name: "Outdoor Sports",
//         subcategory_description: "Football, basketball, and outdoor games",
//         image_url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500"
//       },
//       {
//         subcategory_name: "Activewear",
//         subcategory_description: "Sports clothing and athletic wear",
//         image_url: "https://images.unsplash.com/photo-1544966503-7cc6cd4eb8a1?w=500"
//       },
//       {
//         subcategory_name: "Yoga & Meditation",
//         subcategory_description: "Yoga mats, blocks, and meditation accessories",
//         image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500"
//       }
//     ]
//   },
//   {
//     category_name: "Books & Media",
//     category_description: "Books, movies, and educational content",
//     image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500",
//     is_active: true,
//     subcategories: [
//       {
//         subcategory_name: "Fiction Books",
//         subcategory_description: "Novels, romance, and fiction literature",
//         image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500"
//       },
//       {
//         subcategory_name: "Non-Fiction",
//         subcategory_description: "Biography, self-help, and educational books",
//         image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500"
//       },
//       {
//         subcategory_name: "Movies & TV",
//         subcategory_description: "DVDs, Blu-rays, and digital media",
//         image_url: "https://images.unsplash.com/photo-1489599511229-b26a6a8c6dab?w=500"
//       },
//       {
//         subcategory_name: "Educational",
//         subcategory_description: "Textbooks, courses, and learning materials",
//         image_url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500"
//       }
//     ]
//   },
//   {
//     category_name: "Health & Beauty",
//     category_description: "Skincare, cosmetics, and health products",
//     image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500",
//     is_active: true,
//     subcategories: [
//       {
//         subcategory_name: "Skincare",
//         subcategory_description: "Face creams, serums, and skincare products",
//         image_url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500"
//       },
//       {
//         subcategory_name: "Makeup",
//         subcategory_description: "Lipstick, foundation, and cosmetic products",
//         image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500"
//       },
//       {
//         subcategory_name: "Hair Care",
//         subcategory_description: "Shampoos, conditioners, and hair styling",
//         image_url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500"
//       },
//       {
//         subcategory_name: "Health Supplements",
//         subcategory_description: "Vitamins, minerals, and health supplements",
//         image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500"
//       }
//     ]
//   }
// ];

// const seedCategories = async () => {
//   try {

//     let categoriesCreated = 0;
//     let categoriesUpdated = 0;
//     let subcategoriesCreated = 0;
//     let subcategoriesUpdated = 0;

//     for (const categoryData of categoriesData) {
//       const { subcategories, ...categoryInfo } = categoryData;

//       let existingCategory = await categoryModel.findOne({
//         category_name: categoryData.category_name,
//       });

//       let category;
//       if (existingCategory) {
//         category = await categoryModel.findByIdAndUpdate(
//           existingCategory._id,
//           {
//             ...categoryInfo,
//             updated_at: new Date(),
//           },
//           { new: true, runValidators: true }
//         );
//         categoriesUpdated++;
//         console.log(` Updated category: ${category.category_name}`);
//       } else {
//         category = new categoryModel(categoryInfo);
//         await category.save();
//         categoriesCreated++;
//         console.log(`🆕 Created category: ${category.category_name}`);
//       }

//       for (const subcategoryData of subcategories) {
//         let existingSubcategory = await subcategoryModel.findOne({
//           subcategory_name: subcategoryData.subcategory_name,
//           category_id: category._id,
//         });
//           console.log(subcategoryData.image_url)


//         if (existingSubcategory) {
//           console.log("this si call ",existingSubcategory._id)
//           await subcategoryModel.findByIdAndUpdate(
//             existingSubcategory._id,
//             {
//               ...subcategoryData,
//               image_url:subcategoryData.image_url,
//               category_id: category._id,
//               updated_at: new Date(),
//             },
//             { new: true, runValidators: true }
//           );

//           subcategoriesUpdated++;
//           console.log(`   Updated subcategory: ${subcategoryData.subcategory_name}`);
//         } else {
//           const subcategory = new subcategoryModel({
//             ...subcategoryData,
//             category_id: category._id,
//           });
//           await subcategory.save();
//           subcategoriesCreated++;
//           console.log(`  Created subcategory: ${subcategoryData.subcategory_name}`);
//         }
//       }
//     }
// } catch (error) {
//     console.error(' Error during seeding:', error.message);
//     throw error;
//   }
// };




// const clearData = async () => {
//   try {
//     console.log('🗑️  Clearing existing data...');
//     await Subcategory.deleteMany({});
//     await Category.deleteMany({});
//     console.log(' Data cleared successfully');
//   } catch (error) {
//     console.error('Error clearing data:', error.message);
//     throw error;
//   }
// };

// const runSeeder = async (clearFirst = false) => {
//   try {
//     if (mongoose.connection.readyState !== 1) {
//       await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adminpanel');
//       console.log('📡 Connected to MongoDB');
//     }

//     if (clearFirst) {
//       await clearData();
//     }

//     await seedCategories();

//     console.log('🏁 Seeder execution completed');
//   } catch (error) {
//     console.error('Seeder failed:', error);
//     process.exit(1);
//   }
// };

//     module.exports = {
//     seedCategories,
//     clearData,
//     runSeeder
//     };

//     if (require.main === module) {
//     const args = process.argv.slice(2);
//     const clearFirst = args.includes('--clear');
    
//     runSeeder(clearFirst)
//         .then(() => {
//         console.log('✨ Process completed successfully');
//         process.exit(0);
//         })
//         .catch((error) => {
//         console.error('Process failed:', error);
//         process.exit(1);
//         });
//     }
const mongoose = require('mongoose');
const subcategoryModel = require('../models/master/subcategoryModel');
const categoryModel = require('../models/master/categoryModel');

const categoriesData = [
  {
    category_name: "Electronics",
    category_description: "Latest electronic gadgets and devices",
    image_url: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500",
    is_active: true,
    subcategories: [
      {
        subcategory_name: "Smartphones",
        subcategory_description: "Latest smartphones and mobile devices",
        image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500"
      },
      {
        subcategory_name: "Laptops",
        subcategory_description: "Gaming and business laptops",
        image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500"
      },
      {
        subcategory_name: "Headphones",
        subcategory_description: "Wireless and wired headphones",
        image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
      },
      {
        subcategory_name: "Cameras",
        subcategory_description: "Digital cameras and accessories",
        image_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500"
      }
    ]
  },
  {
    category_name: "Fashion",
    category_description: "Trendy clothing and accessories",
    image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500",
    is_active: true,
    subcategories: [
      {
        subcategory_name: "Men's Clothing",
        subcategory_description: "Shirts, pants, and men's fashion",
        image_url: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500"
      },
      {
        subcategory_name: "Women's Clothing",
        subcategory_description: "Dresses, tops, and women's fashion",
        image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500"
      },
      {
        subcategory_name: "Shoes",
        subcategory_description: "Sneakers, formal shoes, and footwear",
        image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"
      },
      {
        subcategory_name: "Accessories",
        subcategory_description: "Watches, bags, and fashion accessories",
        image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
      }
    ]
  },
  {
    category_name: "Home & Garden",
    category_description: "Furniture and home improvement items",
    image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
    is_active: true,
    subcategories: [
      {
        subcategory_name: "Furniture",
        subcategory_description: "Sofas, chairs, and home furniture",
        image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"
      },
      {
        subcategory_name: "Kitchen Appliances",
        subcategory_description: "Refrigerators, microwaves, and kitchen tools",
        image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500"
      },
      {
        subcategory_name: "Garden Tools",
        subcategory_description: "Gardening equipment and outdoor tools",
        image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500"
      },
      {
        subcategory_name: "Home Decor",
        subcategory_description: "Wall art, lighting, and decorative items",
        image_url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500"
      }
    ]
  },
  {
    category_name: "Sports & Fitness",
    category_description: "Sports equipment and fitness gear",
    image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500",
    is_active: true,
    subcategories: [
      {
        subcategory_name: "Gym Equipment",
        subcategory_description: "Weights, treadmills, and fitness machines",
        image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500"
      },
      {
        subcategory_name: "Outdoor Sports",
        subcategory_description: "Football, basketball, and outdoor games",
        image_url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500"
      },
      {
        subcategory_name: "Activewear",
        subcategory_description: "Sports clothing and athletic wear",
        image_url: "https://images.unsplash.com/photo-1544966503-7cc6cd4eb8a1?w=500"
      },
      {
        subcategory_name: "Yoga & Meditation",
        subcategory_description: "Yoga mats, blocks, and meditation accessories",
        image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500"
      }
    ]
  },
  {
    category_name: "Books & Media",
    category_description: "Books, movies, and educational content",
    image_url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500",
    is_active: true,
    subcategories: [
      {
        subcategory_name: "Fiction Books",
        subcategory_description: "Novels, romance, and fiction literature",
        image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500"
      },
      {
        subcategory_name: "Non-Fiction",
        subcategory_description: "Biography, self-help, and educational books",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500"
      },
      {
        subcategory_name: "Movies & TV",
        subcategory_description: "DVDs, Blu-rays, and digital media",
        image_url: "https://images.unsplash.com/photo-1489599511229-b26a6a8c6dab?w=500"
      },
      {
        subcategory_name: "Educational",
        subcategory_description: "Textbooks, courses, and learning materials",
        image_url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500"
      }
    ]
  },
  {
    category_name: "Health & Beauty",
    category_description: "Skincare, cosmetics, and health products",
    image_url: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500",
    is_active: true,
    subcategories: [
      {
        subcategory_name: "Skincare",
        subcategory_description: "Face creams, serums, and skincare products",
        image_url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500"
      },
      {
        subcategory_name: "Makeup",
        subcategory_description: "Lipstick, foundation, and cosmetic products",
        image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500"
      },
      {
        subcategory_name: "Hair Care",
        subcategory_description: "Shampoos, conditioners, and hair styling",
        image_url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500"
      },
      {
        subcategory_name: "Health Supplements",
        subcategory_description: "Vitamins, minerals, and health supplements",
        image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500"
      }
    ]
  }
];

const seedCategories = async () => {
  try {
    let categoriesCreated = 0;
    let categoriesUpdated = 0;
    let subcategoriesCreated = 0;
    let subcategoriesUpdated = 0;

    for (const categoryData of categoriesData) {
      const { subcategories, ...categoryInfo } = categoryData;

      let existingCategory = await categoryModel.findOne({
        category_name: categoryData.category_name,
      });

      let category;
      if (existingCategory) {
        category = await categoryModel.findByIdAndUpdate(
          existingCategory._id,
          {
            ...categoryInfo,
            updated_at: new Date(),
          },
          { new: true, runValidators: true }
        );
        categoriesUpdated++;
        console.log(`✏️ Updated category: ${category.category_name}`);
      } else {
        category = new categoryModel(categoryInfo);
        await category.save();
        categoriesCreated++;
        console.log(`🆕 Created category: ${category.category_name}`);
      }

      for (const subcategoryData of subcategories) {
        let existingSubcategory = await subcategoryModel.findOne({
          subcategory_name: subcategoryData.subcategory_name,
          category_id: category._id,
        });

        if (existingSubcategory) {
          console.log()
          console.log(`🔄 Updating subcategory: ${subcategoryData.subcategory_name}`);
          console.log(`   Old image URL: ${existingSubcategory.image_url}`);
          console.log(`   New image URL: ${subcategoryData.image_url}`);
          
          const updatedSubcategory = await subcategoryModel.findByIdAndUpdate(
            existingSubcategory._id,
            {
              // ...subcategoryData,
              image:subcategoryData.image_url,
              category_id: category._id,
              updated_at: new Date(),
            },
            { new: true, runValidators: true }
          );

          subcategoriesUpdated++;
          console.log(`✏️ Updated subcategory: ${updatedSubcategory.subcategory_name}`);
          console.log(`   Updated image URL: ${updatedSubcategory.image}`);
        } else {
          console.log(subcategoryData.image_url,'====================================simple')
          const subcategory = new subcategoryModel({
            subcategory_name: subcategoryData.subcategory_name,
            image:subcategoryData.image_url,
            category_id: category._id,
          });
          await subcategory.save();
          subcategoriesCreated++;
          console.log(`🆕 Created subcategory: ${subcategory.subcategory_name}`);
          console.log(`🆕 Created subcategory: ${subcategory.image}`);

        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Categories created: ${categoriesCreated}`);
    console.log(`   Categories updated: ${categoriesUpdated}`);
    console.log(`   Subcategories created: ${subcategoriesCreated}`);
    console.log(`   Subcategories updated: ${subcategoriesUpdated}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    throw error;
  }
};

const clearData = async () => {
  try {
    console.log('🗑️  Clearing existing data...');
    await subcategoryModel.deleteMany({});
    await categoryModel.deleteMany({});
    console.log('✅ Data cleared successfully');
  } catch (error) {
    console.error('❌ Error clearing data:', error.message);
    throw error;
  }
};

const runSeeder = async (clearFirst = false) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adminpanel');
      console.log('📡 Connected to MongoDB');
    }

    if (clearFirst) {
      await clearData();
    }

    await seedCategories();

    console.log('🏁 Seeder execution completed');
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
  }
};

module.exports = {
  seedCategories,
  clearData,
  runSeeder
};

if (require.main === module) {
  const args = process.argv.slice(2);
  const clearFirst = args.includes('--clear');
  
  runSeeder(clearFirst)
    .then(() => {
      console.log('✨ Process completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Process failed:', error);
      process.exit(1);
    });
}