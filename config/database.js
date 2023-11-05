const mongoose = require("mongoose");
require("dotenv").config()



const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then((data) => {
            console.log("connection is estabblished at ", data.connection.host)
        })
        .catch((error) => {
            console.log(error)
        })
}

module.exports = dbConnect