const orderSchema = require("../models/order");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler")
const userSchema = require("../models/user");
const itemSchema = require("../models/item")



//  understand this and try to make it more optimised
exports.createOrder = catchAsyncError(
    async (req, res, next) => {
        const itemId = req.params.id;

        const _id = req.decode._id;
        const { quantity, address, totalAmount } = req.body;

        if (!quantity || !address || !totalAmount) {
            return next(new ErrorHandler("please provide all details ", 404))
        }


        if (!itemId) {
            return next(new ErrorHandler("please provide an Item ID", 404))
        }

        const response1 = await orderSchema.create({ itemInfo: itemId, userId: _id, quantity, address, totalAmount })


        const response2 = await userSchema.findByIdAndUpdate({ _id: _id }, { $push: { orders: response1._id } }, { new: true });
        const item = await itemSchema.findById({ _id: itemId });

        const response3 = await userSchema.findByIdAndUpdate({ _id: item.restaurentid }, { $push: { orders: response1._id } }, { new: true });


        res.status(200)
            .json(
                {
                    success: true,
                    message: "Order is placed",
                    data: response2
                }
            )





    }
)

exports.markOrderInProgress = catchAsyncError(
    async (req, res, next) => {

        const orderId = req.params.id;

        if (!orderId) {
            return next(new ErrorHandler("please provide an ID", 404))
        }



        const response = await orderSchema.findByIdAndUpdate({ _id: orderId }, { orderStatus: "in-progress" }, { new: true });

        res.status(200)
            .json(
                {
                    success: true,
                    message: "Order is marked as In-progress ",
                    data: response
                }
            )

    }
)



exports.markOrderCompleted = catchAsyncError(
    async (req, res, next) => {

        const orderId = req.params.id;

        if (!orderId) {
            return next(new ErrorHandler("please provide an ID", 404))
        }



        const response = await orderSchema.findByIdAndUpdate({ _id: orderId }, { orderStatus: "completed" }, { new: true });

        res.status(200)
            .json(
                {
                    success: true,
                    message: "Order is marked as completed ",
                    data: response
                }
            )


    }
)

