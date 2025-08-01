const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    console.error("Error caught in middleware:", err);  // ADD THIS LINE

    let error = { ...err };
    error.message = err.message;

    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        error = new ErrorHandler(message, 400);
    }

    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        error = new ErrorHandler(message, 400);
    }

    if (err.name === "JsonWebTokenError") {
        const message = "JSON Web Token is invalid. Please try again.";
        error = new ErrorHandler(message, 401);
    }

    if (err.name === "TokenExpiredError") {
        const message = "JSON Web Token has expired. Please login again.";
        error = new ErrorHandler(message, 401);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
    });
};

// const ErrorHandler = require("../utils/errorHandler");

// module.exports = (err, req, res, next) => {
//     err.statusCode = err.statusCode || 500;
//     err.message = err.message || "Internal Server Error";

//     // Wrong mongodb Id error
//     if (err.name === "CastError") {
//         const message = `Resource not found. Invalid: ${err.path}`;
//         err = new ErrorHandler(message, 400);
//     };

//     // Mongoose duplicate key error
//     if (err.code === 11000) {
//         const message = `Resource already exists. Duplicate: ${err.path}`;
//         err = new ErrorHandler(message, 400);
//     };

//     // Wrong JWT error
//     if (err.name === "JsonWebTokenError") {
//         const message = "JSON Web token is invalid, Try again";
//         err = new ErrorHandler(message, 401);
//     };

//     // JWT Expired error
//     if (err.name === "TokenExpiredError") {
//         const message = "Token expired. Please log in again.";
//         err = new ErrorHandler(message, 401);
//     };

//     res.status(err.statusCode).json({
//         status: false,
//         message: err.message
//     })
// }