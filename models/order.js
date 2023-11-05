const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema(
    {
        items: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "ITEM"
            }
        ],
        quantity: {
            type: Number,
            required: true
        },
        address: {
            houseNo: {
                type: Number,
                required: true
            },
            street: {
                type: String,
                required: true
            },
            pinCode: {
                type: Number,
                required: true
            }
        },
        orderStatus: {
            type: String,
            required: true,
            enum: ["pending", "in-progress", "completed"]
        },
        totalAmount: {
            type: Number,
            required: true
        },
        userId: {
            type: String,
            required: true
        }

    }
)

module.exports = orderSchema