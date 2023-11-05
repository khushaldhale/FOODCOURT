const mongoose = require("mongoose");



const itemSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        imageURL: {
            type: String,
            required: true
        },
        restaurentid: {     // means the person who is logged in 
            type: String,
            required: true
        },
        feedback: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "FEEDBACK"
            }
        ]
    }
)
module.exports = mongoose.model("ITEM", itemSchema)