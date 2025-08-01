

const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        minLength: [4, "Name should be at least 4 characters"],
        maxLength: [30, "Name cannot exceed 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [6, "Password should be greater than 6 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

// Password hashing using bcrypt
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE // ✅ Corrected key here
    });
};

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generating password reset token
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

module.exports = mongoose.model("User", userSchema);

// const mongoose = require("mongoose");
// const validator = require("validator");
// const bycypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: [true, "Please enter your name"],
//         minLength: [4, "Name cannot exceed 4 characters"],
//         maxLength: [30, "Name cannot exceed 30 characters"]
//     },
//     email: {
//         type: String,
//         required: [true, "Please enter your email"],
//         unique: true,
//         validate: [validator.isEmail, "Please enter a valid email"],
//     },
//     password: {
//         type: String,
//         required: [true, "Please enter your password"],
//         minLength: [6, "Password should be greater than 6 characters"],
//         select: false
//     },
//     avatar:
//     {
//         public_id: {
//             type: String,
//             required: true
//         },
//         url: {
//             type: String,
//             required: true
//         }
//     },
//     role: {
//         type: String,
//         default: "user",
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     resetPasswordToken: String,
//     resetPasswordExpire: Date,
// });

// // Password hashing using bcrypt
// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         next();
//     }
//     this.password = await bycypt.hash(this.password, 10);
// });

// // JWT Token
// userSchema.methods.getJWTToken = function () {
//     return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRES_IN
//     });
// };

// // Compare password
// userSchema.methods.comparePassword = async function (enteredPassword) {
//     return await bycypt.compare(enteredPassword, this.password);
// };

// // Generating password reset token
// userSchema.methods.getResetPasswordToken = function () {
//     // Generating token
//     const resetToken = crypto.randomBytes(20).toString("hex");

//     // Hasing and adding resetPasswordToken to userSchema
//     this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

//     this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

//     return resetToken;
// };

// module.exports = mongoose.model("User", userSchema);