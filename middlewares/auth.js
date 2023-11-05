const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const jwt = require("jsonwebtoken")



exports.authentication = catchAsyncError(

    async (req, res, next) => {
        const token = req.cookies.token;
        if (!token) {
            return next(new ErrorHandler("Login first", 404))
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return next(new ErrorHandler("token is invalid, please login again", 404))
        }

        req.decode = decode;
        next()
    }

)

exports.isCustomer = catchAsyncError(
    async (req, res, next) => {
        if (req.decode.accountType !== "customer") {
            return next(new ErrorHandler("This is protected route for customer only", 404))
        }
        next()
    }
)

exports.isRestaurent = catchAsyncError(
    async (req, res, next) => {
        if (req.decode.accountType !== "restaurent") {
            return next(new ErrorHandler("This is protected route for restaurent only", 404))
        }
        next()
    }
)


exports.isAdmin = catchAsyncError(
    async (req, res, next) => {
        if (req.decode.accountType !== "admin") {
            return next(new ErrorHandler("This is protected route for admin only", 404))
        }
        next()
    }
)
