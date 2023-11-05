const cloudinary = require("cloudinary").v2



const fileUpload = async (file, folder) => {


    const response = await cloudinary.uploader.upload(file.tempFilePath, {
        folder,
        resource_type: "auto"
    })

    return response.secure_url
}


module.exports = fileUpload