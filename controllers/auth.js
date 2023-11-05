const userSchema = require("../models/user");
const otpSchema = require("../models/otp");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler")
const fileUpload = require("../utils/fileUpload");
const sendMail = require("../utils/sendMail");
const generateOTP = require("../utils/otpGenerator")



exports.sendOTP = catchAsyncError(
    async (req, res, next) => {
        const email = req.body.email;

        if (!email) {
            return next(new ErrorHandler("please provide an email ", 404))
        }

        const otp = generateOTP();

        const response = await otpSchema.create({ otp, email });

        const mail_info = await sendMail("Food Court", email, "OTP for verification", `otp for verification is ${otp}`)


        res.status(200)
            .json(
                {
                    success: true,
                    message: "OTP is sent  succesfully"
                }
            )



    }
)