const { runSeeder } = require('./categoryseeders'); // CommonJS syntax

const start = async () => {
  const args = process.argv.slice(2);
  const clearFirst = args.includes('--clear');

  try {
    await runSeeder(clearFirst);
    console.log('✨ Process completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('💥 Process failed:', error);
    process.exit(1);
  }
};

start(); 
