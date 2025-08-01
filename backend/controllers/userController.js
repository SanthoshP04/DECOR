const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("../config/cloudinary");

// Register User
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const cloud = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
        format: "webp"
    });

    const { name, email, password } = req.body;

    const isEmailMatch = await User.findOne({ email });
    if (isEmailMatch) {
        return next(new ErrorHandler("Email already exists", 401));
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: cloud.public_id,
            url: cloud.secure_url
        }
    });

    sendToken(user, 201, res);
});

// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 401));
    }

    sendToken(user, 200, res);
});

// Logout User
exports.logoutUser = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
});

// Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandler("Please provide an email", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("No user found with this email", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = `Your password reset token is:\n\n${resetURL}\n\nIf you did not request this, please ignore this email.`;

    try {
        await sendEmail({
            email: user.email,
            subject: "Hekto Password Recovery",
            message,
            html: `<p>${message.replace(/\n/g, "<br>")}</p>`
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler(`Failed to send email: ${error.message}`, 500));
    }
});

// ✅ Corrected: Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("Invalid or expired reset token", 400));
    }

    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        return next(new ErrorHandler("Please provide both password and confirm password", 400));
    }

    if (password !== confirmPassword) {
        return next(new ErrorHandler("Passwords do not match", 400));
    }

    user.password = password; // ✅ Let pre('save') hook hash it
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password changed successfully"
    });
});

// Get User Details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
});

// Update Password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatch = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("Password does not match", 400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});

// Update Profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    await User.findByIdAndUpdate(req.user.id, newUserData);

    res.status(200).json({
        success: true,
        message: "Profile Updated Successfully"
    });
});

// Get All Users (Admin)
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    });
});

// Get Single User (Admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        user
    });
});

// Update User Role (Admin)
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`, 400));
    }

    await User.findByIdAndUpdate(req.params.id, newUserData);

    res.status(200).json({
        success: true,
        message: "User updated successfully"
    });
});

// Delete User (Admin)
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`, 400));
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});

// const User = require("../models/userModel");
// const ErrorHandler = require("../utils/errorHandler");
// const catchAsyncError = require("../middleware/catchAsyncError");
// const sendToken = require("../utils/jwtToken");
// const sendEmail = require("../utils/sendEmail");
// const crypto = require("crypto");
// const cloudinary = require("../config/cloudinary");

// exports.registerUser = catchAsyncError(async (req, res, next) => {
//     const cloud = await cloudinary.uploader.upload(req.body.avatar, {
//         folder: "avatars",
//         width: 150,
//         crop: "scale",
//         format: "webp"
//     });

//     const { name, email, password } = req.body;

//     const isEmailMatch = await User.findOne({ email });
//     if (isEmailMatch) {
//         return next(new ErrorHandler("Email already exists", 401));
//     };

//     const user = await User.create({
//         name,
//         email,
//         password,
//         avatar: {
//             public_id: cloud.public_id,
//             url: cloud.secure_url
//         }
//     });

//     sendToken(user, 201, res);
// });

// // Login user
// exports.loginUser = catchAsyncError(async (req, res, next) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//         return next(new ErrorHandler("Please provide email and password", 400));
//     };
//     const user = await User.findOne({ email }).select("+password");
//     if (!user) {
//         return next(new ErrorHandler("Invalid email or password", 401));
//     };
//     const isPasswordMatch = await user.comparePassword(password);
//     if (!isPasswordMatch) {
//         return next(new ErrorHandler("Invalid email or password", 401));
//     };

//     sendToken(user, 200, res);
// });

// // Logout user
// exports.logoutUser = catchAsyncError(async (req, res, next) => {
//     res.cookie("token", null, {
//         expires: new Date(Date.now()),
//         httpOnly: true
//     });

//     res.status(200).json({
//         success: true,
//         message: "Logged out successfully"
//     });
// });

// // Forgot password
// exports.forgotPassword = catchAsyncError(async (req, res, next) => {
//     const { email } = req.body;

//     // Validate email input
//     if (!email) {
//         return next(new ErrorHandler("Please provide an email", 400));
//     }

//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//         return next(new ErrorHandler("No user found with this email", 404));
//     }

//     // Generate reset token
//     const resetToken = user.getResetPasswordToken();
//     await user.save({ validateBeforeSave: false });

//     // Construct reset URL
//     const resetURL = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

//     // Email message
//     const message = `Your password reset token is:\n\n${resetURL}\n\nIf you did not request this, please ignore this email.`;

//     try {
//         // Send email
//         await sendEmail({
//             email: user.email,
//             subject: "Hekto Password Recovery",
//             message,
//             html: `<p>${message.replace(/\n/g, "<br>")}</p>`
//         });

//         res.status(200).json({
//             success: true,
//             message: `Email sent to ${user.email} successfully`
//         });
//     } catch (error) {
//         // Reset token fields on error
//         user.resetPasswordToken = undefined;
//         user.resetPasswordExpire = undefined;
//         await user.save({ validateBeforeSave: false });

//         return next(new ErrorHandler(`Failed to send email: ${error.message}`, 500));
//     }
// });

// // Reset password
// exports.resetPassword = catchAsyncError(async (req, res, next) => {
//     // Hash the incoming token
//     const resetPasswordToken = crypto
//         .createHash("sha256")
//         .update(req.params.token)
//         .digest("hex");

//     // Find user with valid token and unexpired reset time
//     const user = await User.findOne({
//         resetPasswordToken,
//         resetPasswordExpire: { $gt: Date.now() }
//     });

//     if (!user) {
//         return next(new ErrorHandler("Invalid or expired reset token", 400));
//     }

//     // Validate passwords
//     const { password, confirmPassword } = req.body;
//     if (!password || !confirmPassword) {
//         return next(new ErrorHandler("Please provide both password and confirm password", 400));
//     }

//     if (password !== confirmPassword) {
//         return next(new ErrorHandler("Passwords do not match", 400));
//     }

//     // Hash new password
//     const bcrypt = require("bcryptjs");
//     user.password = await bcrypt.hash(password, 10);
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     // Save updated user
//     await user.save();

//     res.status(200).json({
//         success: true,
//         message: "Password changed successfully"
//     });
// });
// // Get user details
// exports.getUserDetails = catchAsyncError(async (req, res, next) => {
//     const user = await User.findById(req.user.id);
//     res.status(200).json({
//         success: true,
//         user
//     });
// });

// // Update user password
// exports.updatePassword = catchAsyncError(async (req, res, next) => {
//     const user = await User.findById(req.user.id).select("+password");

//     const isPasswordMatch = await user.comparePassword(req.body.oldPassword);
//     if (!isPasswordMatch) {
//         return next(new ErrorHandler("Old password is incorrect", 400));
//     };

//     if (req.body.newPassword !== req.body.confirmPassword) {
//         return next(new ErrorHandler("Password does not match", 400));
//     }

//     user.password = req.body.newPassword;

//     await user.save();

//     sendToken(user, 200, res);
// });

// // Update user profile
// exports.updateProfile = catchAsyncError(async (req, res, next) => {
//     const newUserData = {
//         name: req.body.name,
//         email: req.body.email
//     }

//     await User.findByIdAndUpdate(req.user.id, newUserData);

//     res.status(200).json({
//         success: true,
//         message: "Profile Updated Successfully"
//     });
// });

// // Get all users for (admin)
// exports.getAllUsers = catchAsyncError(async (req, res, next) => {
//     const users = await User.find();
//     res.status(200).json({
//         success: true,
//         users
//     });
// });

// // Get a single user for (admin)
// exports.getSingleUser = catchAsyncError(async (req, res, next) => {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//         return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
//     }
//     res.status(200).json({
//         success: true,
//         user
//     });
// });

// // Update user role
// exports.updateUserRole = catchAsyncError(async (req, res, next) => {
//     const newUserData = {
//         name: req.body.name,
//         email: req.body.email,
//         role: req.body.role
//     }

//     const user = await User.findById(req.params.id);
//     if (!user) {
//         return next(new ErrorHandler(`User does not exists with the id: ${req.params.id}`, 400));
//     };

//     await User.findByIdAndUpdate(req.params.id, newUserData);

//     res.status(200).json({
//         success: true,
//         message: "User Update Successfully!!"
//     });
// });

// // Delete user
// exports.deleteUser = catchAsyncError(async (req, res, next) => {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//         return next(new ErrorHandler(`User does not exists with the id: ${req.params.id}`, 400));
//     };

//     const imageId = user.avatar.public_id;

//     await cloudinary.v2.uploader.destroy(imageId);

//     await user.deleteOne();

//     res.status(200).json({
//         success: true,
//         message: "User deleted successfully"
//     });
// });