const { sequelize } = require('../config/database');

async function updateOrganizerIdToNullable() {
  try {
    console.log('Starting migration: Making organizerId nullable...');
    
    // Update the organizer_id column to allow NULL
    await sequelize.query(`
      ALTER TABLE events 
      MODIFY COLUMN organizer_id VARCHAR(36) NULL;
    `);
    
    console.log('✓ Migration completed: organizerId is now nullable');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  updateOrganizerIdToNullable()
    .then(() => {
      console.log('Migration successful!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = updateOrganizerIdToNullable;
