const mongoose = require("mongoose");



const feedbackSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            required: true
        },
        review: {
            type: String,
            required: true
        },
        itemId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        }

    }
)

module.exports = mongoose.model("FEEDBACK", feedbackSchema)