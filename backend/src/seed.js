const bcrypt = require('bcryptjs');
const db = require('./config/database');
const { seedTestUsers } = require('./utils/seedDatabase');

// Run seeder
(async () => {
  try {
    console.log('Starting manual seed...');
    await seedTestUsers();
    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
})();
