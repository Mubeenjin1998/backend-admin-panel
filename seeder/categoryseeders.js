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
//         console.log(`✏️ Updated category: ${category.category_name}`);
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

//         if (existingSubcategory) {
//           console.log()
//           console.log(`🔄 Updating subcategory: ${subcategoryData.subcategory_name}`);
//           console.log(`   Old image URL: ${existingSubcategory.image_url}`);
//           console.log(`   New image URL: ${subcategoryData.image_url}`);
          
//           const updatedSubcategory = await subcategoryModel.findByIdAndUpdate(
//             existingSubcategory._id,
//             {
//               // ...subcategoryData,
//               image:subcategoryData.image_url,
//               category_id: category._id,
//               updated_at: new Date(),
//             },
//             { new: true, runValidators: true }
//           );

//           subcategoriesUpdated++;
//           console.log(`✏️ Updated subcategory: ${updatedSubcategory.subcategory_name}`);
//           console.log(`   Updated image URL: ${updatedSubcategory.image}`);
//         } else {
//           console.log(subcategoryData.image_url,'====================================simple')
//           const subcategory = new subcategoryModel({
//             subcategory_name: subcategoryData.subcategory_name,
//             image:subcategoryData.image_url,
//             category_id: category._id,
//           });
//           await subcategory.save();
//           subcategoriesCreated++;
//           console.log(`🆕 Created subcategory: ${subcategory.subcategory_name}`);
//           console.log(`🆕 Created subcategory: ${subcategory.image}`);

//         }
//       }
//     }

//     console.log(`\n📊 Summary:`);
//     console.log(`   Categories created: ${categoriesCreated}`);
//     console.log(`   Categories updated: ${categoriesUpdated}`);
//     console.log(`   Subcategories created: ${subcategoriesCreated}`);
//     console.log(`   Subcategories updated: ${subcategoriesUpdated}`);

//   } catch (error) {
//     console.error('❌ Error during seeding:', error.message);
//     throw error;
//   }
// };

// const clearData = async () => {
//   try {
//     console.log('🗑️  Clearing existing data...');
//     await subcategoryModel.deleteMany({});
//     await categoryModel.deleteMany({});
//     console.log('✅ Data cleared successfully');
//   } catch (error) {
//     console.error('❌ Error clearing data:', error.message);
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
//     console.error('❌ Seeder failed:', error);
//     process.exit(1);
//   }
// };

// module.exports = {
//   seedCategories,
//   clearData,
//   runSeeder
// };

// if (require.main === module) {
//   const args = process.argv.slice(2);
//   const clearFirst = args.includes('--clear');
  
//   runSeeder(clearFirst)
//     .then(() => {
//       console.log('✨ Process completed successfully');
//       process.exit(0);
//     })
//     .catch((error) => {
//       console.error('❌ Process failed:', error);
//       process.exit(1);
//     });
// }

const mongoose = require('mongoose');
const categoryModel = require('../models/master/categoryModel'); // Only one model now


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
        image_url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",
        sub_subcategories: [
          {
            name: "Android Phones",
            description: "Smartphones powered by Android OS",
            image_url: "https://images.unsplash.com/photo-1512499617640-c2f999098c53?w=500"
          },
          {
            name: "iPhones",
            description: "Apple iPhones with iOS",
            image_url: "https://images.unsplash.com/photo-1510557880182-3a935d016b84?w=500"
          },
          {
            name: "Gaming Phones",
            description: "High-performance smartphones for gaming",
            image_url: "https://images.unsplash.com/photo-1606813902917-5b0eae6ec308?w=500"
          }
        ]
      },
      {
        subcategory_name: "Laptops",
        subcategory_description: "Gaming and business laptops",
        image_url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500",
        sub_subcategories: [
          {
            name: "Gaming Laptops",
            description: "High-performance laptops for gamers",
            image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500"
          },
          {
            name: "Ultrabooks",
            description: "Lightweight and thin laptops",
            image_url: "https://images.unsplash.com/photo-1587202372775-98926c4f6b2a?w=500"
          },
          {
            name: "Business Laptops",
            description: "Reliable laptops for professionals",
            image_url: "https://images.unsplash.com/photo-1610465299996-3cfb8f1c3f36?w=500"
          }
        ]
      },
      {
        subcategory_name: "Headphones",
        subcategory_description: "Wireless and wired headphones",
        image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        sub_subcategories: [
          {
            name: "Wireless Headphones",
            description: "Bluetooth headphones for mobility",
            image_url: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=500"
          },
          {
            name: "Wired Headphones",
            description: "Headphones with 3.5mm or USB connection",
            image_url: "https://images.unsplash.com/photo-1583225272834-8d5dfb1a6c64?w=500"
          },
          {
            name: "Noise Cancelling",
            description: "Headphones with active noise cancellation",
            image_url: "https://images.unsplash.com/photo-1612831208664-cf9a22f8c1b8?w=500"
          }
        ]
      },
      {
        subcategory_name: "Cameras",
        subcategory_description: "Digital cameras and accessories",
        image_url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500",
        sub_subcategories: [
          {
            name: "DSLR",
            description: "Professional DSLR cameras",
            image_url: "https://images.unsplash.com/photo-1519183071298-a2962be90b8e?w=500"
          },
          {
            name: "Mirrorless",
            description: "Compact cameras with interchangeable lenses",
            image_url: "https://images.unsplash.com/photo-1584466977773-2f5d5b3a59c2?w=500"
          },
          {
            name: "Action Cameras",
            description: "Rugged and waterproof cameras for action shots",
            image_url: "https://images.unsplash.com/photo-1511556820780-d912e42b4980?w=500"
          }
        ]
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
        image_url: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500",
        sub_subcategories: [
          {
            name: "Shirts",
            description: "Formal and casual shirts",
            image_url: "https://images.unsplash.com/photo-1520975918318-3cc98d4369e0?w=500"
          },
          {
            name: "T-Shirts",
            description: "Casual cotton and graphic t-shirts",
            image_url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500"
          },
          {
            name: "Jeans",
            description: "Slim, straight, and relaxed fit jeans",
            image_url: "https://images.unsplash.com/photo-1583002196311-7c92a0b3b070?w=500"
          }
        ]
      },
      {
        subcategory_name: "Women's Clothing",
        subcategory_description: "Dresses, tops, and women's fashion",
        image_url: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=500",
        sub_subcategories: [
          {
            name: "Dresses",
            description: "Party and casual dresses",
            image_url: "https://images.unsplash.com/photo-1583496661160-e4e5b46e9b11?w=500"
          },
          {
            name: "Tops",
            description: "Trendy and casual tops",
            image_url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4a?w=500"
          },
          {
            name: "Skirts",
            description: "Mini, midi, and maxi skirts",
            image_url: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=500"
          }
        ]
      },
      {
        subcategory_name: "Shoes",
        subcategory_description: "Sneakers, formal shoes, and footwear",
        image_url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
        sub_subcategories: [
          {
            name: "Sneakers",
            description: "Casual and sports sneakers",
            image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
          },
          {
            name: "Formal Shoes",
            description: "Dress shoes for formal occasions",
            image_url: "https://images.unsplash.com/photo-1535058311268-0d8a4d809f61?w=500"
          },
          {
            name: "Sandals",
            description: "Summer sandals for comfort",
            image_url: "https://images.unsplash.com/photo-1584776290851-a4d4bb5e99e9?w=500"
          }
        ]
      },
      {
        subcategory_name: "Accessories",
        subcategory_description: "Watches, bags, and fashion accessories",
        image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
        sub_subcategories: [
          {
            name: "Watches",
            description: "Smartwatches and analog watches",
            image_url: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=500"
          },
          {
            name: "Bags",
            description: "Handbags, backpacks, and clutches",
            image_url: "https://images.unsplash.com/photo-1505028106030-e07ea1bd80c3?w=500"
          },
          {
            name: "Belts",
            description: "Leather and fabric belts",
            image_url: "https://images.unsplash.com/photo-1593032465171-8d942b16d3be?w=500"
          }
        ]
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
        image_url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500",
        sub_subcategories: [
          {
            name: "Sofas",
            description: "Comfortable seating options for your living room",
            image_url: "https://images.unsplash.com/photo-1582582494700-775aeef307a1?w=500"
          },
          {
            name: "Chairs",
            description: "Dining chairs, office chairs, and more",
            image_url: "https://images.unsplash.com/photo-1598300042247-2f67e47c88cc?w=500"
          },
          {
            name: "Tables",
            description: "Coffee tables, dining tables, and desks",
            image_url: "https://images.unsplash.com/photo-1578894381163-e72c17f2d888?w=500"
          }
        ]
      },
      {
        subcategory_name: "Kitchen Appliances",
        subcategory_description: "Refrigerators, microwaves, and kitchen tools",
        image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500",
        sub_subcategories: [
          {
            name: "Refrigerators",
            description: "Single-door, double-door, and smart fridges",
            image_url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500"
          },
          {
            name: "Microwaves",
            description: "Solo, grill, and convection microwaves",
            image_url: "https://images.unsplash.com/photo-1606788075761-64836dc7f356?w=500"
          },
          {
            name: "Blenders",
            description: "Hand blenders, mixers, and juicers",
            image_url: "https://images.unsplash.com/photo-1591012911207-0dbf9ecdf35d?w=500"
          }
        ]
      },
      {
        subcategory_name: "Garden Tools",
        subcategory_description: "Gardening equipment and outdoor tools",
        image_url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=500",
        sub_subcategories: [
          {
            name: "Shovels",
            description: "Digging and soil-turning tools",
            image_url: "https://images.unsplash.com/photo-1523661149972-0becaca2016d?w=500"
          },
          {
            name: "Watering Cans",
            description: "Manual and automatic watering systems",
            image_url: "https://images.unsplash.com/photo-1569596082827-1f955570f62f?w=500"
          },
          {
            name: "Lawn Mowers",
            description: "Electric and manual lawn mowers",
            image_url: "https://images.unsplash.com/photo-1621616950015-5eaa3bba2221?w=500"
          }
        ]
      },
      {
        subcategory_name: "Home Decor",
        subcategory_description: "Wall art, lighting, and decorative items",
        image_url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500",
        sub_subcategories: [
          {
            name: "Wall Art",
            description: "Paintings, posters, and decorative frames",
            image_url: "https://images.unsplash.com/photo-1618221728258-3d79a4b1a2dd?w=500"
          },
          {
            name: "Lighting",
            description: "Ceiling lights, lamps, and decorative lighting",
            image_url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500"
          },
          {
            name: "Vases",
            description: "Decorative flower vases",
            image_url: "https://images.unsplash.com/photo-1598300189329-7f239d0f84cc?w=500"
          }
        ]
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
      image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500",
      sub_subcategories: [
        {
          name: "Dumbbells",
          description: "Various weights and types of dumbbells",
          image_url: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=500"
        },
        {
          name: "Treadmills",
          description: "Motorized and manual treadmills",
          image_url: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=500"
        },
        {
          name: "Weight Benches",
          description: "Adjustable and flat benches for strength training",
          image_url: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=500"
        }
      ]
    },
    {
      subcategory_name: "Outdoor Sports",
      subcategory_description: "Football, basketball, and outdoor games",
      image_url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500",
      sub_subcategories: [
        {
          name: "Football",
          description: "Soccer balls, nets, and accessories",
          image_url: "https://images.unsplash.com/photo-1607840970924-9b4ba64b4a4e?w=500"
        },
        {
          name: "Basketball",
          description: "Basketballs, hoops, and gear",
          image_url: "https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=500"
        },
        {
          name: "Tennis",
          description: "Rackets, balls, and tennis accessories",
          image_url: "https://images.unsplash.com/photo-1590641266877-98f9dba4d0f5?w=500"
        }
      ]
    },
    {
      subcategory_name: "Activewear",
      subcategory_description: "Sports clothing and athletic wear",
      image_url: "https://images.unsplash.com/photo-1544966503-7cc6cd4eb8a1?w=500",
      sub_subcategories: [
        {
          name: "Running Shoes",
          description: "Shoes designed for running and athletics",
          image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
        },
        {
          name: "Sports T-Shirts",
          description: "Breathable and comfortable athletic t-shirts",
          image_url: "https://images.unsplash.com/photo-1534081333815-ae5019106622?w=500"
        },
        {
          name: "Yoga Pants",
          description: "Flexible and stretchable pants for workouts",
          image_url: "https://images.unsplash.com/photo-1600180758890-6c9f0ec74c61?w=500"
        }
      ]
    },
    {
      subcategory_name: "Yoga & Meditation",
      subcategory_description: "Yoga mats, blocks, and meditation accessories",
      image_url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500",
      sub_subcategories: [
        {
          name: "Yoga Mats",
          description: "Non-slip mats for yoga practice",
          image_url: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=500"
        },
        {
          name: "Meditation Cushions",
          description: "Comfortable cushions for meditation",
          image_url: "https://images.unsplash.com/photo-1616004655122-818bfe96ccaa?w=500"
        },
        {
          name: "Yoga Blocks",
          description: "Blocks for yoga support and flexibility",
          image_url: "https://images.unsplash.com/photo-1604594849809-dfedbc827105?w=500"
        }
      ]
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
      image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
      sub_subcategories: [
        {
          name: "Mystery & Thriller",
          description: "Suspenseful and thrilling novels",
          image_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500"
        },
        {
          name: "Romance",
          description: "Love stories and romantic novels",
          image_url: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=500"
        },
        {
          name: "Fantasy",
          description: "Fantasy and magical adventure novels",
          image_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500"
        }
      ]
    },
    {
      subcategory_name: "Non-Fiction",
      subcategory_description: "Biography, self-help, and educational books",
      image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
      sub_subcategories: [
        {
          name: "Biographies",
          description: "Life stories of famous personalities",
          image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500"
        },
        {
          name: "Self-Help",
          description: "Books on personal growth and motivation",
          image_url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=500"
        },
        {
          name: "History",
          description: "Books on historical events and figures",
          image_url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=500"
        }
      ]
    },
    {
      subcategory_name: "Movies & TV",
      subcategory_description: "DVDs, Blu-rays, and digital media",
      image_url: "https://images.unsplash.com/photo-1489599511229-b26a6a8c6dab?w=500",
      sub_subcategories: [
        {
          name: "Action Movies",
          description: "High-paced and action-packed films",
          image_url: "https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500"
        },
        {
          name: "Drama",
          description: "Emotional and storytelling movies",
          image_url: "https://images.unsplash.com/photo-1505685296765-3a2736de412f?w=500"
        },
        {
          name: "Comedy",
          description: "Humorous and entertaining films",
          image_url: "https://images.unsplash.com/photo-1606761568499-6d2451b23c06?w=500"
        }
      ]
    },
    {
      subcategory_name: "Educational",
      subcategory_description: "Textbooks, courses, and learning materials",
      image_url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500",
      sub_subcategories: [
        {
          name: "School Textbooks",
          description: "Books for school-level education",
          image_url: "https://images.unsplash.com/photo-1616401784845-180882ba9ba6?w=500"
        },
        {
          name: "Online Courses",
          description: "Digital learning and skill development",
          image_url: "https://images.unsplash.com/photo-1551836022-deb4988cc6c2?w=500"
        },
        {
          name: "Workbooks",
          description: "Practice books for students",
          image_url: "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9991?w=500"
        }
      ]
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
      image_url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500",
      sub_subcategories: [
        {
          name: "Face Creams",
          description: "Moisturizers and day creams for different skin types",
          image_url: "https://images.unsplash.com/photo-1600181951731-7c1d2f2b3f25?w=500"
        },
        {
          name: "Serums",
          description: "Anti-aging, brightening, and hydrating serums",
          image_url: "https://images.unsplash.com/photo-1600180758895-45a5c1e5e6e8?w=500"
        },
        {
          name: "Sunscreens",
          description: "UV protection creams and lotions",
          image_url: "https://images.unsplash.com/photo-1600181952204-8a8e0c9e4a36?w=500"
        }
      ]
    },
    {
      subcategory_name: "Makeup",
      subcategory_description: "Lipstick, foundation, and cosmetic products",
      image_url: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500",
      sub_subcategories: [
        {
          name: "Lipsticks",
          description: "Matte, glossy, and long-lasting lip colors",
          image_url: "https://images.unsplash.com/photo-1584999734485-4dfc3e3be8a4?w=500"
        },
        {
          name: "Foundations",
          description: "Liquid, powder, and stick foundations for all skin tones",
          image_url: "https://images.unsplash.com/photo-1583567990655-4c4d6b8a5a58?w=500"
        },
        {
          name: "Eye Makeup",
          description: "Mascaras, eyeliners, and eyeshadow palettes",
          image_url: "https://images.unsplash.com/photo-1596464716120-9e4d0d0b8d8e?w=500"
        }
      ]
    },
    {
      subcategory_name: "Hair Care",
      subcategory_description: "Shampoos, conditioners, and hair styling",
      image_url: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=500",
      sub_subcategories: [
        {
          name: "Shampoos",
          description: "Cleansing formulas for various hair types",
          image_url: "https://images.unsplash.com/photo-1600180758920-47e4a8b5b5c2?w=500"
        },
        {
          name: "Conditioners",
          description: "Hydrating and repairing conditioners",
          image_url: "https://images.unsplash.com/photo-1600181951712-8a4cfe1cbd56?w=500"
        },
        {
          name: "Hair Styling Products",
          description: "Hair gels, sprays, and creams for styling",
          image_url: "https://images.unsplash.com/photo-1600181951872-0f82c8d9194e?w=500"
        }
      ]
    },
    {
      subcategory_name: "Health Supplements",
      subcategory_description: "Vitamins, minerals, and health supplements",
      image_url: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500",
      sub_subcategories: [
        {
          name: "Vitamins",
          description: "Daily multivitamins for overall health",
          image_url: "https://images.unsplash.com/photo-1600180758895-ec8d573b9e50?w=500"
        },
        {
          name: "Protein Supplements",
          description: "Protein powders and shakes for muscle building",
          image_url: "https://images.unsplash.com/photo-1600181951988-bf8e4c962d7b?w=500"
        },
        {
          name: "Herbal Supplements",
          description: "Natural herbal remedies for wellness",
          image_url: "https://images.unsplash.com/photo-1600181952018-74c5a62a46f6?w=500"
        }
      ]
    }
  ]
  }




];



// const seedCategories = async () => {
//   try {
//     let categoriesCreated = 0;
//     let categoriesUpdated = 0;
//     let subcategoriesCreated = 0;
//     let subcategoriesUpdated = 0;

//     for (const categoryData of categoriesData) {
//       const { subcategories, ...categoryInfo } = categoryData;

//       let existingCategory = await categoryModel.findOne({
//         name: categoryData.category_name,
//         parent_id: null
//       });

//       let category;
//       if (existingCategory) {
//         category = await categoryModel.findByIdAndUpdate(
//           existingCategory._id,
//           {
//             name: categoryData.category_name,
//             description: categoryData.category_description,
//             image_url: categoryData.image_url,
//             is_active: categoryData.is_active,
//             level: 0,
//             updated_at: new Date(),
//           },
//           { new: true, runValidators: true }
//         );
//         categoriesUpdated++;
//         console.log(`✏️ Updated category: ${category.name}`);
//       } else {
//         category = new categoryModel({
//           name: categoryData.category_name,
//           description: categoryData.category_description,
//           image_url: categoryData.image_url,
//           is_active: categoryData.is_active,
//           level: 0,
//           parent_id: null,
//         });
//         await category.save();
//         categoriesCreated++;
//         console.log(`🆕 Created category: ${category.name}`);
//       }

//       for (const subcategoryData of subcategories) {
//         const { sub_subcategories,...subcategoriesInfo}= subcategoryData;
//         let existingSubcategory = await categoryModel.findOne({
//           name: subcategoryData.subcategory_name,
//           parent_id: category._id
//         });

//         if (existingSubcategory) {
//           const updatedSubcategory = await categoryModel.findByIdAndUpdate(
//             existingSubcategory._id,
//             {
//               name: subcategoryData.subcategory_name,
//               description: subcategoryData.subcategory_description,
//               image_url: subcategoryData.image_url,
//               parent_id: category._id,
//               is_active: true,
//               level: 1,
//               updated_at: new Date()
//             },
//             { new: true, runValidators: true }
//           );
//           subcategoriesUpdated++;
//           console.log(`✏️ Updated subcategory: ${updatedSubcategory.name}`);
//         } else {
//           const subcategory = new categoryModel({
//             name: subcategoryData.subcategory_name,
//             description: subcategoryData.subcategory_description,
//             image_url: subcategoryData.image_url,
//             parent_id: category._id,
//             is_active: true,
//             level: 1
//           });
//           await subcategory.save();
//           subcategoriesCreated++;
//           console.log(`🆕 Created subcategory: ${subcategory.name}`);
//         }


//       }
//     }

//     console.log(`\n📊 Summary:`);
//     console.log(`   Categories created: ${categoriesCreated}`);
//     console.log(`   Categories updated: ${categoriesUpdated}`);
//     console.log(`   Subcategories created: ${subcategoriesCreated}`);
//     console.log(`   Subcategories updated: ${subcategoriesUpdated}`);

//   } catch (error) {
//     console.error('❌ Error during seeding:', error.message);
//     throw error;
//   }
// };

const seedCategories = async () => {
  try {
    let categoriesCreated = 0;
    let categoriesUpdated = 0;
    let subcategoriesCreated = 0;
    let subcategoriesUpdated = 0;
    let subSubcategoriesCreated = 0;
    let subSubcategoriesUpdated = 0;

    for (const categoryData of categoriesData) {
      const { subcategories, ...categoryInfo } = categoryData;

      // -------- CATEGORY (Level 0) --------
      let existingCategory = await categoryModel.findOne({
        name: categoryData.category_name,
        parent_id: null
      });

      let category;
      if (existingCategory) {
        category = await categoryModel.findByIdAndUpdate(
          existingCategory._id,
          {
            name: categoryData.category_name,
            description: categoryData.category_description,
            image_url: categoryData.image_url,
            is_active: categoryData.is_active,
            level: 0,
            updated_at: new Date(),
          },
          { new: true, runValidators: true }
        );
        categoriesUpdated++;
        console.log(`✏️ Updated category: ${category.name}`);
      } else {
        category = new categoryModel({
          name: categoryData.category_name,
          description: categoryData.category_description,
          image_url: categoryData.image_url,
          is_active: categoryData.is_active,
          level: 0,
          parent_id: null,
        });
        await category.save();
        categoriesCreated++;
        console.log(`🆕 Created category: ${category.name}`);
      }

      // -------- SUBCATEGORY (Level 1) --------
      for (const subcategoryData of subcategories) {
        const { sub_subcategories, ...subcategoriesInfo } = subcategoryData;

        let existingSubcategory = await categoryModel.findOne({
          name: subcategoryData.subcategory_name,
          parent_id: category._id
        });

        let subcategory;
        if (existingSubcategory) {
          subcategory = await categoryModel.findByIdAndUpdate(
            existingSubcategory._id,
            {
              name: subcategoryData.subcategory_name,
              description: subcategoryData.subcategory_description,
              image_url: subcategoryData.image_url,
              parent_id: category._id,
              is_active: true,
              level: 1,
              updated_at: new Date()
            },
            { new: true, runValidators: true }
          );
          subcategoriesUpdated++;
          console.log(`✏️ Updated subcategory: ${subcategory.name}`);
        } else {
          subcategory = new categoryModel({
            name: subcategoryData.subcategory_name,
            description: subcategoryData.subcategory_description,
            image_url: subcategoryData.image_url,
            parent_id: category._id,
            is_active: true,
            level: 1
          });
          await subcategory.save();
          subcategoriesCreated++;
          console.log(`🆕 Created subcategory: ${subcategory.name}`);
        }

        // -------- SUB-SUBCATEGORY (Level 2) --------
        if (sub_subcategories && sub_subcategories.length > 0) {
          for (const subSubData of sub_subcategories) {
            let existingSubSubcategory = await categoryModel.findOne({
              name: subSubData.name,
              parent_id: subcategory._id
            });

            if (existingSubSubcategory) {
              await categoryModel.findByIdAndUpdate(
                existingSubSubcategory._id,
                {
                  name: subSubData.name,
                  description: subSubData.description || "",
                  image_url: subSubData.image_url || "",
                  parent_id: subcategory._id,
                  is_active: true,
                  level: 2,
                  updated_at: new Date()
                },
                { new: true, runValidators: true }
              );
              subSubcategoriesUpdated++;
              console.log(`✏️ Updated sub-subcategory: ${subSubData.name}`);
            } else {
              const subSubcategory = new categoryModel({
                name: subSubData.name,
                description: subSubData.description || "",
                image_url: subSubData.image_url || "",
                parent_id: subcategory._id,
                is_active: true,
                level: 2
              });
              await subSubcategory.save();
              subSubcategoriesCreated++;
              console.log(`🆕 Created sub-subcategory: ${subSubData.name}`);
            }
          }
        }
      }
    }

    // Summary
    console.log(`\n📊 Summary:`);
    console.log(`   Categories created: ${categoriesCreated}`);
    console.log(`   Categories updated: ${categoriesUpdated}`);
    console.log(`   Subcategories created: ${subcategoriesCreated}`);
    console.log(`   Subcategories updated: ${subcategoriesUpdated}`);
    console.log(`   Sub-subcategories created: ${subSubcategoriesCreated}`);
    console.log(`   Sub-subcategories updated: ${subSubcategoriesUpdated}`);

  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    throw error;
  }
};

const clearData = async () => {
  try {
    console.log('🗑️  Clearing all categories...');
    await categoryModel.deleteMany({});
    console.log('✅ Categories cleared');
  } catch (error) {
    console.error('❌ Error clearing categories:', error.message);
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
