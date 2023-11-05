const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler")
const userSchema = require("../models/user");



exports.getAlluser = catchAsyncError(
    async (req, res, next) => {
        const response = await userSchema.find({});


        res.status(200)
            .json(
                {
                    success: true,
                    message: "All users are fetched ",
                    data: response
                }
            )

    }
)


exports.deleteUser = catchAsyncError(
    async (req, res, next) => {
        const userId = req.params.id;

        if (!userId) {
            return next(new ErrorHandler("please provide an ID", 404))
        }

        const response = await userSchema.findByIdAndDelete({ _id: userId });

        res.status(200)
            .json(
                {
                    success: true,
                    message: "user is deleted",
                    data: response
                }
            )

    }
)

exports.blockUser = catchAsyncError(
    async (req, res, next) => {
        const userId = req.params.id;

        if (!userId) {
            return next(new ErrorHandler("please provide an ID", 404))
        }

        const response = await userSchema.findByIdAndUpdate({ _id: userId }, { isisBlocked: true, $push: { blockedUsers: userId } }, { new: true });

        res.status(200)
            .json(
                {
                    success: true,
                    message: "user is blocked succesfully",
                    data: response
                }
            )

    }
)