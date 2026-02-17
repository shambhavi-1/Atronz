const mongoose = require("mongoose");
require("dotenv").config();

const seedUsers = require("./seedUsers");
const seedFood = require("./seedFood");
const seedOrders = require("./seedOrders");
const seedFeedback = require("./seedFeedback");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("🌱 Seeding database...");
    await seedUsers();
    await seedFood();
    await seedOrders(); 
    await seedFeedback(); 
    console.log("✅ Database seeded successfully");
    process.exit();
  })
  .catch(err => console.error(err));
