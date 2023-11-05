const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler")
const itemSchema = require("../models/item")
const fileUpload = require("../utils/fileUpload")
const userSchema = require("../models/user")
require("dotenv").config()


exports.createItem = catchAsyncError(
    async (req, res, next) => {
        const _id = req.decode._id;

        const { restaurentid, name, description, amount } = req.body;

        const image = req.files.image;

        if (!image) {
            return next(new ErrorHandler("please provide an image", 404))
        }

        if (!restaurentid || !name || !description || !amount) {
            return next(new ErrorHandler("please provide details", 404))
        }

        const is_existing = await itemSchema.findOne({ name });

        if (is_existing) {
            return next(new ErrorHandler("This item already exists , please add new", 404))
        }

        const imageURL = await fileUpload(image, "foodCourt");

        const response1 = await itemSchema.create({ restaurentid, name, description, amount, imageURL });


        const response2 = await userSchema.findByIdAndUpdate({ _id: _id }, { $push: { items: response1._id } }, { new: true }).populate("items").exec();


        res.status(200)
            .json(
                {
                    success: true,
                    message: "Itme is inserted in system",
                    data: response2
                }
            )




    }
)


exports.deleteItem = catchAsyncError(
    async (req, res, next) => {
        const _id = req.decode._id;

        const itemId = req.params.id;

        if (!itemId) {
            return next(new ErrorHandler("please provide an ItemId", 404))
        }

        const response = await itemSchema.findByIdAndDelete({ _id: itemId });

        const response2 = await userSchema.findByIdAndUpdate({ _id: _id }, { $pull: { items: itemId } }, { new: true }).populate("items").exec();


        res.status(200)
            .json(
                {
                    success: true,
                    message: "Item is deleted succesfully",
                    data: response2
                }
            )
    }
)


exports.getAllItems = catchAsyncError(
    async (req, res, next) => {

        const response = await itemSchema.find({});


        res.status(200)
            .json(
                {
                    success: true,
                    message: "All items are fetched",
                    data: response
                }
            )

    }
)


exports.getParticularItem = catchAsyncError(
    async (req, res, next) => {
        const itemId = req.params.id;

        if (!itemId) {
            return next(new ErrorHandler("please provide an Item Id", 404))
        }

        const response = await itemSchema.findById({ _id: itemId });

        res.status(200)
            .json(
                {
                    success: true,
                    message: "Particular item is fetched",
                    data: response
                }
            )
    }
)


exports.getItemsForUser = catchAsyncError(
    async (req, res, next) => {
        const _id = req.decode._id;

        const response = await itemSchema.find({ restaurentid: _id });

        res.status(200)
            .json(
                {
                    success: true,
                    message: "Items for particular restaurent is retrieved",
                    data: response
                }
            )

    }
)

// onesuggestion for future , while hitting the API to change the item image , first delete the old image and then change
exports.updateItem = catchAsyncError(
    async (req, res, next) => {
        const itemId = req.params.id;
        const { name, description, amount } = req.body;

        const image = req.files.image;

        if (!itemId) {
            return next(new ErrorHandler("please provide an Id"))
        }

        if (!name || !description || !amount || !image) {
            return next(new ErrorHandler("please provide a data", 404))
        }


        const imageURL = await fileUpload(image, "foodCourt");

        const response = await itemSchema.findByIdAndUpdate({ _id: itemId }, { name, description, amount, imageURL }, { new: true });

        res.status(200)
            .json(
                {
                    success: true,
                    message: "Item is updated succesfully",
                    data: response
                }
            )





    }
)




exports.addToCart = catchAsyncError(
    async (req, res, next) => {
        const _id = req.decode._id;

        const itemId = req.params.id;

        if (!itemId) {
            return next(new ErrorHandler("please provide an ID", 404))
        }


        const response = await userSchema.findByIdAndUpdate({ _id: _id }, { $push: { addToCart: itemId } }, { new: true }).populate("addTocart").exec();

        res.status(200)
            .json(
                {
                    success: true,
                    message: "Item is added to cart",
                    data: response
                }
            )

    }
)


exports.removeFromCart = catchAsyncError(
    async (req, res, next) => {

        const _id = req.decode._id;

        const itemId = req.params.id;

        if (!itemId) {
            return next(new ErrorHandler("please provide an ID", 404))
        }


        const response = await userSchema.findByIdAndUpdate({ _id: _id }, { $pull: { addToCart: itemId } }, { new: true }).populate("addTocart").exec();

        res.status(200)
            .json(
                {
                    success: true,
                    message: "Item is removed from cart",
                    data: response
                }
            )


    }
)



exports.showCartItems = catchAsyncError(
    async (req, res, next) => {
        const _id = req.decode._id;

        const response = await userSchema.findById({ _id: _id }).populate("addToCart").exec();


        res.status(200)
            .json(
                {
                    success: true,
                    message: "Cart items are fetched",
                    data: response
                }
            )
    }
)






exports.addToWishlist = catchAsyncError(
    async (req, res, next) => {
        const _id = req.decode._id;

        const itemId = req.params.id;

        if (!itemId) {
            return next(new ErrorHandler("please provide an ID", 404))
        }


        const response = await userSchema.findByIdAndUpdate({ _id: _id }, { $push: { wishlist: itemId } }, { new: true }).populate("wishlist").exec();

        res.status(200)
            .json(
                {
                    success: true,
                    message: "Item is added to wishlist",
                    data: response
                }
            )

    }
)


exports.removeFromWishlist = catchAsyncError(
    async (req, res, next) => {

        const _id = req.decode._id;

        const itemId = req.params.id;

        if (!itemId) {
            return next(new ErrorHandler("please provide an ID", 404))
        }


        const response = await userSchema.findByIdAndUpdate({ _id: _id }, { $pull: { wishlist: itemId } }, { new: true }).populate("wishlist").exec();

        res.status(200)
            .json(
                {
                    success: true,
                    message: "Item is removed from wishlist",
                    data: response
                }
            )


    }
)



exports.showWishlistItems = catchAsyncError(
    async (req, res, next) => {
        const _id = req.decode._id;

        const response = await userSchema.findById({ _id: _id }).populate("wishlist").exec();


        res.status(200)
            .json(
                {
                    success: true,
                    message: "wishlist items are fetched",
                    data: response
                }
            )
    }
)