const mongoose = require("mongoose");




const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        contactNo: {
            type: Number,
            required: true
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        restaurentName: {
            type: String,

        },
        token: String,
        resetPasswordExpiry: Date,
        accountType: {
            type: String,
            required: true,
            enum: ["customer", "restaurent", "admin"]
        },
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ITEM"
            }
        ],
        addToCart: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ITEM"
            }
        ],
        items: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ITEM"
            }
        ],
        blockedUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "USER"
            }
        ],
        orders: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ORDER"
            }
        ]

    }
)

module.exports = mongoose.model("USER", userSchema)