const userSchema = require("../models/user");
const otpSchema = require("../models/otp");
const catchAsyncError = require("../utils/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler")
const fileUpload = require("../utils/fileUpload");
const sendMail = require("../utils/sendMail");
const generateOTP = require("../utils/otpGenerator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { response } = require("express");
require("dotenv").config()

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
                    message: "OTP is sent  succesfully, please check your email",
                    data: response
                }
            )



    }
)


exports.register = catchAsyncError(
    async (req, res, next) => {
        const { firstName, lastName, email, password, contactNo, otp, accountType } = req.body;


        if (!otp) {
            return next(new ErrorHandler("plaese provide an OTP", 404))
        }

        const otpFromDB = await otpSchema.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(otpFromDB[0].otp)
        if (otpFromDB[0].otp !== otp) {
            return next(new ErrorHandler("OTP is invalid", 404))
        }


        const is_existing = await userSchema.findOne({ email });

        if (is_existing) {
            return next(new ErrorHandler("you are already  registered ,please login", 404))
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const response = await userSchema.create({ firstName, lastName, email, password: hashedPassword, contactNo, accountType });

        res.status(200)
            .json(
                {
                    success: true,
                    message: "user is successfully registered",
                    data: response
                }
            )


    }
)


exports.login = catchAsyncError(
    async (req, res, next) => {

        const { email, password } = req.body;

        if (!email, !password) {
            return next(new ErrorHandler("please provide creadentials ", 404))
        }

        const is_existing = await userSchema.findOne({ email });

        if (!is_existing) {
            return next(new ErrorHandler("please register yourself first", 404))
        }

        if (await bcrypt.compare(password, is_existing.password)) {
            const token = jwt.sign(
                {
                    _id: is_existing._id,
                    accountType: is_existing.accountType,
                    email

                },
                process.env.JWT_SECRET, {
                expiresIn: "24h"
            }
            )


            res.cookie("token", token, {
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
            })
                .status(200)
                .json(
                    {
                        success: true,
                        message: "user is logged in",
                        data: is_existing,
                        token

                    }
                )
        }
        else {

            return next(new ErrorHandler("password is not correct", 404))
        }

    }
)


exports.logout = catchAsyncError(
    async (req, res, next) => {
        res.cookie("token", null, {
            httpOnly: true,
            expires: new Date(Date.now())
        })
            .status(200)
            .json(
                {
                    success: true,
                    message: "user is logged out"
                }
            )
    }
)


// change paswor , edit data , forget and resetpassowrd


exports.changePassword = catchAsyncError(
    async (req, res, next) => {
        const _id = req.decode._id;
        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            return next(new ErrorHandler("please provide passwords ", 404))
        }

        if (password !== confirmPassword) {
            return next(new ErrorHandler("passsword do not match ", 404))
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("hashed pass is ", hashedPassword)

        const response = await userSchema.findByIdAndUpdate({ _id: _id }, { password: hashedPassword }, { new: true });


        res.status(200)
            .json(
                {
                    success: true,
                    message: "password is updated succesfully",
                    data: response
                }
            )
    }
)

exports.editProfile = catchAsyncError(
    async (req, res, next) => {
        const { firstName, lastName, contactNo } = req.body;
        const _id = req.decode._id;

        if (!firstName || !lastName || !contactNo) {
            return next(new ErrorHandler("please provide a details ", 404))
        }

        const response = await userSchema.findByIdAndUpdate({ _id: _id }, { firstName, lastName, contactNo }, { new: true });

        res.status(200)
            .json(
                {
                    success: true,
                    message: "Profile is updated succesfully",
                    data: response
                }
            )
    }
)


exports.forgotPassword = catchAsyncError(
    async (req, res, next) => {
        const email = req.body.email;

        if (!email) {
            return next(new ErrorHandler("please provide an email", 404))
        }

        const is_existing = await userSchema.findOne({ email });

        if (!is_existing) {
            return next(new ErrorHandler("please  register yourself first ", 404))
        }

        const token = crypto.randomUUID();


        const URL = `${process.env.FRONTENDURL}reset-password/${token}`;

        await sendMail('FOOD COURT', email, "RESET PASSWORD LINK", `Reset password link is ${URL} `);

        is_existing.token = token;
        is_existing.resetPasswordExpiry = new Date(Date.now() + 5 * 60 * 1000)

        await is_existing.save();

        res.status(200)
            .json(
                {
                    success: true,
                    message: "reset password link is sent, please check ur email"
                }
            )

    }
)


exports.resetPassword = catchAsyncError(
    async (req, res, next) => {
        const token = req.params.token;
        const password = req.body.password;

        if (!password) {
            return next(new ErrorHandler("please provide a password", 404))
        }

        if (!token) {
            return next(new ErrorHandler("please provide a token", 404))
        }

        const user = await userSchema.findOne({ token });

        if (!user) {
            return next(new ErrorHandler("token is invalid", 404))
        }


        if (user.resetPasswordExpiry < Date.now()) {
            return next(new ErrorHandler("Time is expired to reset passsword", 404))
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        user.password = hashedPassword;
        await user.save();


        res.status(200)
            .json(
                {
                    success: true,
                    message: "password is reseted succesfully",
                    data: user
                }
            )
    }
)