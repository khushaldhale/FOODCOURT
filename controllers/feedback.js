const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler")
const feedbackSchema = require("../models/feedback");
const orderSchema = require("../models/order");
const itemSchema = require("../models/item")



exports.writeFeedback = catchAsyncError(
    async (req, res, next) => {
        const { rating, review } = req.body;

        const itemId = req.params.id;
        const userId = req.decode._id;

        if (!rating || !review) {
            return next(new ErrorHandler("please provide a data", 404))
        }
        if (!itemId) {
            return next(new ErrorHandler("please provide an Item Id", 404))
        }


        // two conditions 1.feedback can be given only on purchased product 
        // only one feedback , cant give multiple

        const isPurchased = await orderSchema.findone({ itemId, userId });

        if (!isPurchased) {
            return next(new ErrorHandler("This product is not purchased by you , you cant write review"))
        }

        const isfeedbackGiven = await feedbackSchema.findOne({ userId, itemId });

        if (isfeedbackGiven) {
            return next(new ErrorHandler("you have already given a feedback , you cant give a twice"))

        }


        const response1 = await feedbackSchema.create({ userId, itemId, review, rating });

        const response2 = await itemSchema.findByIdAndUpdate({ _id: itemId }, { $push: { feedback: response1._id } }, { new: true }).populate("feedback").exec();


        res.status(200)
            .json(
                {
                    success: true,
                    message: "feddback is given to the item",
                    data: response2
                }
            )
    }
)