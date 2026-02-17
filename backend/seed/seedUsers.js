const User = require("../models/User");
const bcrypt = require("bcryptjs");

const seedUsers = async () => {
  const adminEmail = "admin@cafelytic.com";
  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
      addresses: []
    });
    console.log(`✅ Created admin user: ${adminEmail}`);
  } else {
    console.log(`⚠️ Admin user already exists: ${adminEmail}`);
  }

  // Create regular users
  const regularUsers = [
    { name: "Joy", email: "joy@example.com", password: "password123" },
    { name: "Alice", email: "alice@example.com", password: "password123" },
    { name: "Bob", email: "bob@example.com", password: "password123" },
    { name: "Charlie", email: "charlie@example.com", password: "password123" }
  ];

  for (const userData of regularUsers) {
    const existingUser = await User.findOne({ email: userData.email });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await User.create({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: "USER",
        addresses: []
      });
      console.log(`✅ Created regular user: ${userData.email}`);
    } else {
      console.log(`⚠️ Regular user already exists: ${userData.email}`);
    }
  }
};

module.exports = seedUsers;
