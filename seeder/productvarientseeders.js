const VariantAttribute = require('../models/master/variantAttributeModel');
const VariantAttributeValue = require('../models/master/variantAttributeValueModel');
const mongoose = require('mongoose');

const attributes = [
  {
    name: 'size',
    display_name: 'Size',
    input_type: 'select',
    is_required: true,
    sort_order: 1,
    values: [
      { value: 'S', display_value: 'Small' },
      { value: 'M', display_value: 'Medium' },
      { value: 'L', display_value: 'Large' },
      { value: 'XL', display_value: 'Extra Large' },
    ],
  },
  {
    name: 'color',
    display_name: 'Color',
    input_type: 'color_picker',
    is_required: true,
    sort_order: 2,
    values: [
      { value: 'black', display_value: 'Black', color_code: '#000000' },
      { value: 'white', display_value: 'White', color_code: '#FFFFFF' },
      { value: 'red', display_value: 'Red', color_code: '#FF0000' },
      { value: 'blue', display_value: 'Blue', color_code: '#0000FF' },
    ],
  },
  {
    name: 'material',
    display_name: 'Material',
    input_type: 'select',
    is_required: false,
    sort_order: 3,
    values: [
      { value: 'cotton', display_value: 'Cotton' },
      { value: 'polyester', display_value: 'Polyester' },
      { value: 'wool', display_value: 'Wool' },
    ],
  },

  {
    name: 'shoe_size',
    display_name: 'Shoe Size (US)',
    input_type: 'select',
    is_required: true,
    sort_order: 4,
    values: [
      { value: '7', display_value: 'US 7' },
      { value: '8', display_value: 'US 8' },
      { value: '9', display_value: 'US 9' },
      { value: '10', display_value: 'US 10' },
      { value: '11', display_value: 'US 11' },
    ],
  },

  {
    name: 'brand',
    display_name: 'Brand',
    input_type: 'select',
    is_required: true,
    sort_order: 10,
    values: [
      { value: 'apple', display_value: 'Apple' },
      { value: 'samsung', display_value: 'Samsung' },
      { value: 'sony', display_value: 'Sony' },
      { value: 'lg', display_value: 'LG' },
      { value: 'dell', display_value: 'Dell' },
      { value: 'hp', display_value: 'HP' },
    ],
  },
  {
    name: 'storage',
    display_name: 'Storage',
    input_type: 'select',
    is_required: false,
    sort_order: 11,
    values: [
      { value: '64gb', display_value: '64 GB' },
      { value: '128gb', display_value: '128 GB' },
      { value: '256gb', display_value: '256 GB' },
      { value: '512gb', display_value: '512 GB' },
      { value: '1tb', display_value: '1 TB' },
    ],
  },
  {
    name: 'ram',
    display_name: 'RAM',
    input_type: 'select',
    is_required: false,
    sort_order: 12,
    values: [
      { value: '4gb', display_value: '4 GB' },
      { value: '8gb', display_value: '8 GB' },
      { value: '16gb', display_value: '16 GB' },
      { value: '32gb', display_value: '32 GB' },
    ],
  },
  {
    name: 'screen_size',
    display_name: 'Screen Size',
    input_type: 'select',
    is_required: false,
    sort_order: 13,
    values: [
      { value: '13inch', display_value: '13 inch' },
      { value: '14inch', display_value: '14 inch' },
      { value: '15inch', display_value: '15 inch' },
      { value: '17inch', display_value: '17 inch' },
    ],
  },
  {
    name: 'battery_capacity',
    display_name: 'Battery Capacity',
    input_type: 'select',
    is_required: false,
    sort_order: 14,
    values: [
      { value: '3000mah', display_value: '3000 mAh' },
      { value: '4000mah', display_value: '4000 mAh' },
      { value: '5000mah', display_value: '5000 mAh' },
      { value: '6000mah', display_value: '6000 mAh' },
    ],
  },

  // 🏠 Appliances
  {
    name: 'capacity',
    display_name: 'Capacity',
    input_type: 'select',
    is_required: false,
    sort_order: 20,
    values: [
      { value: '200l', display_value: '200 Liters' },
      { value: '300l', display_value: '300 Liters' },
      { value: '500l', display_value: '500 Liters' },
      { value: '1ton', display_value: '1 Ton' },
      { value: '1_5ton', display_value: '1.5 Ton' },
    ],
  },
  {
    name: 'energy_rating',
    display_name: 'Energy Rating',
    input_type: 'select',
    is_required: false,
    sort_order: 21,
    values: [
      { value: '1star', display_value: '⭐ 1 Star' },
      { value: '2star', display_value: '⭐⭐ 2 Star' },
      { value: '3star', display_value: '⭐⭐⭐ 3 Star' },
      { value: '4star', display_value: '⭐⭐⭐⭐ 4 Star' },
      { value: '5star', display_value: '⭐⭐⭐⭐⭐ 5 Star' },
    ],
  },
];

async function seedVariants() {
  try {
    for (const attr of attributes) {
      let attribute = await VariantAttribute.findOne({ name: attr.name });

      if (attribute) {
        await VariantAttribute.updateOne(
          { _id: attribute._id },
          {
            $set: {
              display_name: attr.display_name,
              input_type: attr.input_type,
              is_required: attr.is_required,
              sort_order: attr.sort_order,
              is_active: true,
            },
          }
        );
      } else {
        attribute = await VariantAttribute.create({
          name: attr.name,
          display_name: attr.display_name,
          input_type: attr.input_type,
          is_required: attr.is_required,
          sort_order: attr.sort_order,
          is_active: true,
        });
      }

      for (const val of attr.values) {
        let value = await VariantAttributeValue.findOne({
          attribute_id: attribute._id,
          value: val.value,
        });

        if (value) {
          await VariantAttributeValue.updateOne(
            { _id: value._id },
            {
              $set: {
                display_value: val.display_value,
                color_code: val.color_code || null,
                sort_order: val.sort_order || 0,
                is_active: true,
              },
            }
          );
        } else {
          await VariantAttributeValue.create({
            attribute_id: attribute._id,
            value: val.value,
            display_value: val.display_value,
            color_code: val.color_code || null,
            sort_order: val.sort_order || 0,
            is_active: true,
          });
        }
      }
    }

    console.log('✅ Variant attributes & values seeded/updated successfully!');
  } catch (err) {
    console.error('❌ Error seeding data:', err);
    throw err;
  }
}
const clearData = async () => {
  try {
    console.log('🗑️  Clearing all categories...');
    await VariantAttribute.deleteMany({});
    console.log('✅ Categories cleared');
  } catch (error) {
    console.error('❌ Error clearing categories:', error.message);
    throw error;
  }
};

const runVariantsSeeder = async (clearFirst = false) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/adminpanel');
      console.log('📡 Connected to MongoDB');
    }

    if (clearFirst) {
      await clearData();
    }

    await seedVariants();

    console.log('🏁 Seeder execution completed');
  } catch (error) {
    console.error('❌ Seeder failed:', error);
    process.exit(1);
  }
};

module.exports = {
    seedVariants,
  runVariantsSeeder,
  clearData,
//   runSeeder
};


if (require.main === module) {
  const args = process.argv.slice(2);
  const clearFirst = args.includes('--clear');
  
  runVariantsSeeder(clearFirst)
    .then(() => {
      console.log('✨ Process completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Process failed:', error);
      process.exit(1);
    });
}

