
const categoryModel = require('../../models/master/categoryModel');
const Category = require('../../models/master/categoryModel');
const Subcategory = require('../../models/master/subcategoryModel');
const Brand = require('../../models/master/brandModel');
const Store = require('../../models/master/storeModel');
const ImageUpload = require('../../utils/imageUpload');
const { default: mongoose } = require('mongoose');

const addCategory = async (req, res) => {
  try {
    const { name, description, parentCategory } = req.body;
    const { parent_id, level } = parentCategory
    const image = req.file ? req.file.filename : null;

    if (!name) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Category name is required'
      });
    }

    let image_url = null;
    if (image) {
      image_url = `${process.env.BASE_URL}/uploads/${image}`;
    }

    let existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: 'Category name already exists'
      });
    }

    let newLevel = 0;

    if (parent_id) {
      const parentCategory = await Category.findById(parent_id);
      if (!parentCategory) {
        return res.status(200).json({
          success:false,
          statusCode: 404,
          message: 'Parent category not found'
        })
      }
      newLevel = parentCategory.level + 1;
    }

    const newCategory = new Category({
      name,
      description,
      image_url,
      parent_id: parent_id || null,
      level: newLevel
    });

    await newCategory.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Category created successfully',
      data: newCategory
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to create category',
      error: error.message
    });
  }
};

//==========================================================================================================================

const updateCategory = async (req, res) => {
  try {
    const { id } = req.query;
    const { name, description, parentCategory } = req.body;
    const { parent_id } = parentCategory || {};
    const image = req.file ? req.file.filename : null;

    if (!id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Category ID is required'
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Category name is required'
      });
    }

    const existingCategory = await Category.findOne({
      name: name.trim(),
      _id: { $ne: id }
    });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: 'Category name already exists'
      });
    }

    let image_url = null;
    if (image) {
      image_url = `${process.env.BASE_URL}/uploads/${image}`;
    }

    let newLevel = 0;
    if (parent_id) {
      const parentCat = await Category.findById(parent_id);
      if (!parentCat) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          message: 'Parent category not found'
        });
      }
      newLevel = parentCat.level + 1;
    }

    const updateData = {
      name: name.trim(),
      description,
      parent_id: parent_id || null,
      level: newLevel,
      updated_at: Date.now()
    };

    if (image_url) {
      updateData.image_url = image_url;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Category updated successfully',
      data: updatedCategory
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to update category',
      error: error.message
    });
  }
};


const getCategories = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { created_at: -1 }
  };
  try {
    const categories = await categoryModel.find({ is_active: true, level: 0 })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ created_at: -1 });

    const totalCategories = await categoryModel.countDocuments({ is_active: true });
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Categories retrieved successfully',
      data: categories,
      pagination: {
        total: totalCategories,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCategories / limit)
      }
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to retrieve categories',
      error: error.message
    });
  }
}

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Category ID is required'
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: category
    });
  } catch (erro) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to fetch category by ID',
      error: error.message
    });
  }
}

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await Category.findByIdAndUpdate(id, { is_active: false }, { new: true });

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Category deleted successfully',
      data: deletedCategory
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to delete category',
      error: error.message
    });
  }
};

//=======================================================subcategories=======================================================

// const getSubcategoriesbyCategoryId = async (req, res) => {
//   const id = req.query.id;

//   try {
//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         statusCode: 400,
//         message: "Category ID is required"
//       });
//     }

//     const subcategories = await categoryModel.find({
//       parent_id: id,
//       is_active: true
//     })
//       .populate('parent_id','name slug')
//       .select('name slug description image is_active created_at updated_at')
//       .sort({ created_at: -1 });

//     if (!subcategories || subcategories.length === 0) {
//       return res.status(404).json({
//         success: false,
//         statusCode: 404,
//         message: "No subcategories found for this category"
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       statusCode: 200,
//       message: "Subcategories retrieved successfully",
//       data: subcategories,
//       count: subcategories.length
//     });

//   } catch (error) {
//     console.error("Error in getSubcategoriesbyCategoryId:", error);
//     return res.status(500).json({
//       success: false,
//       statusCode: 500,
//       message: "Failed to retrieve subcategories",
//       error: error.message
//     });
//   }
// }

// const getSubcategoriesbyCategoryId = async (req, res) => {
//   try {
//     const id = req.query.id;
//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         statusCode: 400,
//         message: "Category ID is required"
//       });
//     }

//     const categoryData = await categoryModel.aggregate([
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(id),
//           level: 0,
//           is_active: true
//         }
//       },
//       {
//         $graphLookup: {
//           from: "categories",
//           startWith: "$_id",
//           connectFromField: "_id",
//           connectToField: "parent_id",
//           as: "allSubcategories",
//           restrictSearchWithMatch: { is_active: true }
//         }
//       },
//       {
//         $addFields: {
//           subcategories: {
//             $filter: {
//               input: "$allSubcategories",
//               as: "cat",
//               cond: { $eq: ["$$cat.parent_id", "$_id"] }
//             }
//           }
//         }
//       },
//       {
//         $project: {
//           allSubcategories: 0 // we keep only the structured data
//         }
//       }
//     ]);

//     if (!categoryData || categoryData.length === 0) {
//       return res.status(404).json({
//         success: false,
//         statusCode: 404,
//         message: "Category not found or has no children"
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       statusCode: 200,
//       message: "Category with nested subcategories retrieved successfully",
//       data: categoryData[0]
//     });

//   } catch (error) {
//     console.error("Error in getSubcategoriesbyCategoryId:", error);
//     return res.status(500).json({
//       success: false,
//       statusCode: 500,
//       message: "Failed to retrieve category",
//       error: error.message
//     });
//   }
// };

// const getSubcategoriesbyCategoryId = async (req, res) => {
//   const id = req.query.id;

//   try {
//     if (!id) {
//       return res.status(400).json({
//         success: false,
//         statusCode: 400,
//         message: "Category ID is required"
//       });
//     }

//     // Fetch all active categories in one go
//     const allCategories = await categoryModel.find({ is_active: true })
//       .populate('parent_id', 'name slug')
//       .select('name slug description image is_active parent_id created_at updated_at')
//       .sort({ created_at: -1 });

//     // Function to build nested tree recursively
//     const buildTree = (parentId) => {
//       return allCategories
//         .filter(cat => String(cat.parent_id?._id || cat.parent_id) === String(parentId))
//         .map(cat => ({
//           _id: cat._id,
//           name: cat.name,
//           slug: cat.slug,
//           description: cat.description,
//           image: cat.image,
//           is_active: cat.is_active,
//           created_at: cat.created_at,
//           updated_at: cat.updated_at,
//           children: buildTree(cat._id) // recursion
//         }));
//     };

//     const tree = buildTree(id);

//     if (!tree || tree.length === 0) {
//       return res.status(404).json({
//         success: false,
//         statusCode: 404,
//         message: "No subcategories found for this category"
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       statusCode: 200,
//       message: "Subcategories retrieved successfully",
//       data: tree,
//       count: tree.length
//     });

//   } catch (error) {
//     console.error("Error in getSubcategoriesbyCategoryId:", error);
//     return res.status(500).json({
//       success: false,
//       statusCode: 500,
//       message: "Failed to retrieve subcategories",
//       error: error.message
//     });
//   }
// };


const getSubcategoriesbyCategoryId = async (req, res) => {
  try {
    const categoryId = req.query.id;
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Category ID is required"
      });
    }

    const categoryData = await Category.aggregate([
      { 
        $match: { 
          _id: new mongoose.Types.ObjectId(categoryId),
          is_active: true 
        } 
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "parent_id",
          as: "subcategories"
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "subcategories._id",
          foreignField: "parent_id",
          as: "subcategories_children"
        }
      },
      {
        $addFields: {
          subcategories: {
            $map: {
              input: "$subcategories",
              as: "sub",
              in: {
                $mergeObjects: [
                  "$$sub",
                  {
                    children: {
                      $filter: {
                        input: "$subcategories_children",
                        as: "child",
                        cond: { $eq: ["$$child.parent_id", "$$sub._id"] }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      },
      { $project: { subcategories_children: 0 } }
    ]);

    if (!categoryData.length) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Category not found or has no subcategories"
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Category with subcategories retrieved successfully",
      data: categoryData[0]
    });

  } catch (error) {
    console.error("Error in getSubcategoriesbyCategoryId:", error);
    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to retrieve category",
      error: error.message
    });
  }
};



const getSubcategories = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const subcategories = await Subcategory.find({ category_id: categoryId, is_active: true })
      .populate('category_id', 'category_name')
      .sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Subcategories retrieved successfully',
      data: subcategories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to retrieve subcategories',
      error: error.message
    });
  }
}

const addSubcategory = async (req, res) => {
  try {
    const { subcategory_name, subcategory_description, category_id } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!subcategory_name) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Subcategory name is required'
      });
    }

    if (!category_id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Category ID is required'
      });
    }

    let image_url = null;
    if (image) {
      image_url = `${process.env.BASE_URL}/uploads/${image}`;
    }

    let existingSubcategory = await Subcategory.findOne({
      subcategory_name: subcategory_name.trim(),
      category_id: category_id
    });

    if (existingSubcategory) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: 'Subcategory name already exists for this category'
      });
    }

    const newSubcategory = new Subcategory({
      subcategory_name: subcategory_name.trim(),
      subcategory_description,
      category_id,
      image_url
    });

    await newSubcategory.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Subcategory created successfully',
      data: newSubcategory
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to create subcategory',
      error: error.message
    });
  }
};

const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.query;
    const { subcategory_name, subcategory_description, category_id } = req.body;
    const image = req.file ? req.file.filename : null;

    const updateData = {
      subcategory_name: subcategory_name?.trim(),
      subcategory_description,
      category_id,
      updated_at: Date.now()
    };

    if (image) {
      updateData.image_url = `${process.env.BASE_URL}/uploads/${image}`;
    }

    const updatedSubcategory = await Subcategory.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedSubcategory) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Subcategory not found'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Subcategory updated successfully',
      data: updatedSubcategory
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to update subcategory',
      error: error.message
    });
  }
}

const getSubcategoriesAll = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const subcategories = await Subcategory.find({ is_active: true })
      .populate('category_id', 'category_name')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ created_at: -1 });

    const totalSubcategories = await Subcategory.countDocuments({ is_active: true });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Subcategories retrieved successfully',
      data: subcategories,
      meta: {
        total: totalSubcategories,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalSubcategories / limit)
      }
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to retrieve subcategories',
      error: error.message
    });
  }
}

const getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Subcategory ID is required'
      });
    }

    const subcategory = await Subcategory.findById(id)
      .populate('category_id', 'category_name');

    if (!subcategory) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Subcategory not found'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: subcategory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to fetch subcategory by ID',
      error: error.message
    });
  }
}

const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSubcategory = await Subcategory.findByIdAndUpdate(id, { is_active: false }, { new: true });

    if (!deletedSubcategory) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Subcategory not found'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Subcategory deleted successfully',
      data: deletedSubcategory
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to delete subcategory',
      error: error.message
    });
  }
};

//=======================================================brands=======================================================

const addBrand = async (req, res) => {
  try {
    const { brand_name, brand_description, website } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!brand_name) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Brand name is required'
      });
    }

    let logo_url = null;
    if (image) {
      logo_url = `${process.env.BASE_URL}/uploads/${image}`;
    }

    let existingBrand = await Brand.findOne({ brand_name: brand_name.trim() });
    if (existingBrand) {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: 'Brand name already exists'
      });
    }

    const newBrand = new Brand({
      brand_name: brand_name.trim(),
      brand_description,
      logo_url,
      website
    });

    await newBrand.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Brand created successfully',
      data: newBrand
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to create brand',
      error: error.message
    });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { id } = req.query;
    const { brand_name, brand_description, website } = req.body;
    const image = req.file ? req.file.filename : null;

    const updateData = {
      brand_name: brand_name?.trim(),
      brand_description,
      website,
      updated_at: Date.now()
    };

    if (image) {
      updateData.logo_url = `${process.env.BASE_URL}/uploads/${image}`;
    }

    const updatedBrand = await Brand.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedBrand) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Brand not found'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Brand updated successfully',
      data: updatedBrand
    });

  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Brand name already exists. Please use another name.'
      });
    }

    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to update brand',
      error: error.message
    });
  }
};


const getBrands = async (req, res) => {

  console.log("====================================================self===============================")
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const brands = await Brand.find({ is_active: true })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ created_at: -1 });

    const totalBrands = await Brand.countDocuments({ is_active: true });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Brands retrieved successfully',
      data: brands,
      pagination: {
        total: totalBrands,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalBrands / limit)
      }
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to retrieve brands',
      error: error.message
    });
  }
}

const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Brand ID is required'
      });
    }

    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Brand not found'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: brand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to fetch brand by ID',
      error: error.message
    });
  }
}

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBrand = await Brand.findByIdAndUpdate(id, { is_active: false }, { new: true });

    if (!deletedBrand) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Brand not found'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Brand deleted successfully',
      data: deletedBrand
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to delete brand',
      error: error.message
    });
  }
};

//=======================================================store=======================================================




const addStore = async (req, res) => {
  try {
    const {
      store_name,
      store_description,
      owner,
      contact,
      location,
      category,
      business_hours,
      status,
      is_verified,
      features,
      images_url
    } = req.body;


    console.log(req.body)


    const missingFields = [];
    if (!store_name) missingFields.push('store_name');
    if (!owner || !owner.email) missingFields.push('owner.email');
    if (!contact) missingFields.push('contact');
    if (!location) missingFields.push('location');
    // if (!category) missingFields.push('category');

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Required fields missing: ${missingFields.join(', ')}`
      });
    }

    const slug = store_name.trim().toLowerCase().replace(/\s+/g, '-');
    const slugExists = await Store.findOne({ slug });
    if (slugExists) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: `${store_name}  Slug already exists`
      });
    }

    const emailExists = await Store.findOne({
      'owner.email': owner.email,
      status: 'active',
      deleted_at: null
    });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Owner email is already registered with an active store'
      });
    }

    const phone = String(contact.phone.number).trim();
    const contactEmailExist = await Store.findOne({
      'contact.email': contact.email,
      'contact.phone.number': phone
    })

    if (contactEmailExist) {
      return res.status(400).json({
        success: false,
        message: 'Contact email and phone number already exists'
      });
    }

    let uploadedImages = [];
    if (req.files && req.files.length > 0) {
      uploadedImages = req.files.map(file => `/uploads/stores/${file.filename}`);
    }

    const store = new Store({
      store_name: store_name.trim(),
      store_description,
      owner,
      contact,
      location,
      category,
      business_hours,
      status,
      is_verified,
      features,
      slug,
      images_url: images_url ? images_url.concat(uploadedImages) : uploadedImages
    });

    const savedStore = await store.save();

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: savedStore
    });

  } catch (error) {
    console.error('Error adding store:', error);

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${duplicateField} already exists`
      });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const updateStore = async (req, res) => {
  try {
    const { id } = req.query;
    const updateData = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Store ID is required'
      });
    }

    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map(file => `/uploads/stores/${file.filename}`);
      updateData.images_url = updateData.images_url
        ? updateData.images_url.concat(uploadedImages)
        : uploadedImages;
    }

    if (updateData.store_name) {
      const slug = updateData.store_name.trim().toLowerCase().replace(/\s+/g, '-');
      const slugExists = await Store.findOne({ slug, _id: { $ne: id } });
      if (slugExists) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: 'Store name already exists with this slug'
        });
      }
      updateData.slug = slug;
    }

    if (updateData.owner && updateData.owner.email) {
      const emailExists = await Store.findOne({
        'owner.email': updateData.owner.email,
        _id: { $ne: id },
        status: 'active',
        deleted_at: null
      });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'Owner email is already registered with another active store'
        });
      }
    }

    const updatedStore = await Store.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    console.log(updatedStore)

    if (!updatedStore) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Store not found'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Store updated successfully',
      data: updatedStore
    });

  } catch (error) {
    console.error('Error updating store:', error);

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${duplicateField} already exists`
      });
    }

    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

const getStores = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      category,
      is_verified,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;
    const filter = { deleted_at: null };

    if (search) {
      filter.$or = [
        { store_name: { $regex: search, $options: 'i' } },
        { store_description: { $regex: search, $options: 'i' } },
        { 'owner.name': { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      filter.status = status;
    }

    if (category) {
      filter.category = { $in: [category] };
    }

    if (is_verified !== undefined) {
      filter.is_verified = is_verified === 'true';
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const stores = await Store.find(filter)
      .populate('category', 'category_name')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    const totalStores = await Store.countDocuments(filter);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Stores retrieved successfully',
      stores: stores,
      pagination: {
        total: totalStores,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalStores / limit)
      }
    });

  } catch (error) {
    console.error('Error getting stores:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to retrieve stores',
      error: error.message
    });
  }
};

const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Store ID is required'
      });
    }

    const store = await Store.findById(id)
      .populate('category', 'category_name');

    if (!store) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Store not found'
      });
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Store retrieved successfully',
      data: store
    });

  } catch (error) {
    console.error('Error getting store by ID:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to retrieve store',
      error: error.message
    });
  }
};

const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Store ID is required'
      });
    }

    const existingStore = await Store.findById(id);

    if (!existingStore) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Store not found'
      });
    }

    if (existingStore.deleted_at) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Store is already deleted'
      });
    }

    existingStore.deleted_at = new Date();
    existingStore.status = 'inactive';
    await existingStore.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Store deleted successfully',
      data: existingStore
    });

  } catch (error) {
    console.error('Error deleting store:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to delete store',
      error: error.message
    });
  }
};

const addStoreImages = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Store ID is required'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'At least one image is required'
      });
    }

    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Store not found'
      });
    }

    // Upload images to ImageKit
    const uploadedImages = [];
    for (const file of req.files) {
      console.log(file)

      // const imageUrl = await ImageUpload.uploadToImageKit(
      //   file.buffer,
      //   file.filename,
      //   'stores'
      // );
      // const imageUrl = `https://ik.imagekit.io/${process.env.IMAGEKIT_ID}/${file.filename}`;
      const imageUrl = `${process.env.BASE_URL}/uploads/${file.filename}`

      uploadedImages.push(imageUrl);
    }

    // Add new images to existing images
    // const updatedImages = [...(store.images_url || []), ...uploadedImages];
    const updatedImages = [...uploadedImages];


    const updatedStore = await Store.findByIdAndUpdate(
      id,
      { images_url: updatedImages },
      { new: true }
    ).populate('category', 'category_name');

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Images added successfully',
      data: {
        store: updatedStore,
        added_images: uploadedImages,
        total_images: updatedImages.length
      }
    });

  } catch (error) {
    console.error('Error adding store images:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to add images to store',
      error: error.message
    });
  }
};

const removeStoreImages = async (req, res) => {
  try {
    const { id } = req.params;
    const { image_urls } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Store ID is required'
      });
    }

    if (!image_urls || !Array.isArray(image_urls) || image_urls.length === 0) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'image_urls array is required'
      });
    }

    const store = await Store.findById(id);
    if (!store) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: 'Store not found'
      });
    }

    const updatedImages = store.images_url.filter(url => !image_urls.includes(url));

    const updatedStore = await Store.findByIdAndUpdate(
      id,
      { images_url: updatedImages },
      { new: true }
    ).populate('category', 'category_name');

    image_urls.forEach(url => {
      ImageUpload.deleteFromImageKit(url).catch(console.error);
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Images removed successfully',
      data: {
        store: updatedStore,
        removed_images: image_urls,
        total_images: updatedImages.length
      }
    });

  } catch (error) {
    console.error('Error removing store images:', error);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: 'Failed to remove images from store',
      error: error.message
    });
  }
};



module.exports = {
  addCategory,
  updateCategory,
  getCategories,
  deleteCategory,
  getSubcategories,
  getCategoryById,
  addSubcategory,
  updateSubcategory,
  getSubcategoriesAll,
  getSubcategoryById,
  deleteSubcategory,
  addBrand,
  updateBrand,
  getBrands,
  getBrandById,
  deleteBrand,
  addStore,
  updateStore,
  getStores,
  getStoreById,
  deleteStore,
  addStoreImages,
  removeStoreImages,
  getSubcategoriesbyCategoryId
}

