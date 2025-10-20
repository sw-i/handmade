const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sequelize } = require('../config/database');

const generateUUID = () => {
  return crypto.randomUUID();
};

const seedTestUsers = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Hash password for all test accounts
    const hashedPassword = await bcrypt.hash('Test123!', 12);

    const testUsers = [
      {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@test.com',
        password: hashedPassword,
        phone: '+1234567890',
        role: 'admin',
        is_active: true,
        vendorApproved: null
      },
      {
        first_name: 'Vendor',
        last_name: 'User',
        email: 'vendor@test.com',
        password: hashedPassword,
        phone: '+1234567891',
        role: 'vendor',
        is_active: true,
        vendorApproved: true
      },
      {
        first_name: 'Customer',
        last_name: 'User',
        email: 'customer@test.com',
        password: hashedPassword,
        phone: '+1234567892',
        role: 'customer',
        is_active: true,
        vendorApproved: null
      },
      {
        first_name: 'Pending',
        last_name: 'Vendor',
        email: 'pending@test.com',
        password: hashedPassword,
        phone: '+1234567893',
        role: 'vendor',
        is_active: true,
        vendorApproved: false
      }
    ];

    for (const user of testUsers) {
      // Check if user already exists
      const [existing] = await sequelize.query(
        'SELECT id FROM users WHERE email = ?',
        {
          replacements: [user.email],
          type: sequelize.QueryTypes.SELECT
        }
      );

      if (!existing) {
        const userId = generateUUID();
        await sequelize.query(
          `INSERT INTO users (id, first_name, last_name, email, password, phone, role, is_active, email_verified, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())`,
          {
            replacements: [
              userId,
              user.first_name,
              user.last_name,
              user.email,
              user.password,
              user.phone,
              user.role,
              user.is_active
            ]
          }
        );
        console.log(`✅ Created test user: ${user.email} (${user.role})`);
        
        // If vendor, create vendor profile
        if (user.role === 'vendor' && user.vendorApproved !== null) {
          await sequelize.query(
            `INSERT INTO vendors (id, user_id, business_name, business_description, is_approved, created_at, updated_at) 
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            {
              replacements: [
                generateUUID(),
                userId,
                user.first_name === 'Vendor' ? 'Test Vendor Store' : 'Pending Vendor Store',
                user.first_name === 'Vendor' ? 'A test vendor store with quality products' : 'A vendor waiting for approval',
                user.vendorApproved
              ]
            }
          );
          console.log(`✅ Created vendor profile for: ${user.email}`);
        }
      } else {
        console.log(`⏭️  User already exists: ${user.email}`);
      }
    }

    console.log('\n✅ Database seeding completed!');
    console.log('\n📧 Test Account Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('👤 Admin Account:');
    console.log('   Email: admin@test.com');
    console.log('   Password: Test123!');
    console.log('\n🏪 Approved Vendor Account:');
    console.log('   Email: vendor@test.com');
    console.log('   Password: Test123!');
    console.log('\n🛒 Customer Account:');
    console.log('   Email: customer@test.com');
    console.log('   Password: Test123!');
    console.log('\n⏳ Pending Vendor Account (for testing approval):');
    console.log('   Email: pending@test.com');
    console.log('   Password: Test123!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

module.exports = { seedTestUsers };
