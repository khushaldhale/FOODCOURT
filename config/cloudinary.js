const cloudinary = require("cloudinary").v2;
require("dotenv").config()


const cloudinaryConnect = () => {
    try {

        cloudinary.config(
            {
                cloud_name: process.env.CLOUD_NAME,
                api_key: process.env.API_KEY,
                api_secret: process.env.API_SECRET
            }
        )

        console.log("connection is established with cloudinary")
    }
    catch (error) {
        console.log(error)
        console.log("error occured in connecting to cloudinary")
    }
}

module.exports = cloudinaryConnect