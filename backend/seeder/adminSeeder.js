const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Load environment variables from config.env
dotenv.config({ path: "config.env" });

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const dbUri = process.env.DB_URI;

    if (!adminEmail || !adminPassword || !dbUri) {
      throw new Error("Missing required environment variables (ADMIN_EMAIL, ADMIN_PASSWORD, DB_URI).");
    }

    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists with this email.");
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const adminUser = new User({
        name: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        avatar: {
          public_id: "default_admin_avatar",
          url: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        },
      });

      await adminUser.save();
      console.log("✅ Admin user created successfully.");
    }

    process.exit();
  } catch (error) {
    console.error("❌ Error seeding admin user:", error.message);
    process.exit(1);
  }
};

seedAdmin();
