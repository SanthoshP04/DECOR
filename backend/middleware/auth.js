const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Check if user is authenticated
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    let token;

    // 1. Check for token in cookies
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    // 2. Check for token in Authorization header (Bearer token)
    else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // 3. If no token found, throw an error
    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401));
    }

    try {
        // 4. Verify token
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        
        // 5. Find user by ID and ensure they exist
        req.user = await User.findById(decodedData.id);
        if (!req.user) {
            return next(new ErrorHandler("User associated with this token no longer exists", 401));
        }

        next();
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === "JsonWebTokenError") {
            return next(new ErrorHandler("Invalid token, please login again", 401));
        }
        if (error.name === "TokenExpiredError") {
            return next(new ErrorHandler("Token has expired, please login again", 401));
        }
        return next(new ErrorHandler("Authentication error", 401));
    }
});

// Authorize roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Ensure req.user and req.user.role exist
        if (!req.user || !req.user.role) {
            return next(new ErrorHandler("User data not found", 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role '${req.user.role}' is not authorized to access this resource`, 403));
        }
        next();
    };
};
// const ErrorHandler = require("../utils/errorHandler");
// const catchAsyncError = require("./catchAsyncError");
// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

// exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
//     const { token } = req.cookies;

//     if (!token) {
//         return next(new ErrorHandler("Please login to access this resource", 401));
//     };

//     const decodedData = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = await User.findById(decodedData.id);

//     next();
// });

// // Authorize admin roles
// exports.authorizeRoles = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403));
//         }
//         next();
//     }
// }