const express = require("express");
const { sendOTP, register, login, logout, changePassword, editProfile, forgotPassword, resetPassword } = require("../controllers/auth");
const { authentication } = require("../middlewares/auth");
const router = express.Router();




router.get("/send-otp", sendOTP);
router.post("/register", register);
router.post("/login", login);
router.get("/logout", authentication, logout);
router.put("/change-password", authentication, changePassword);
router.put("/edit-profile", authentication, editProfile);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword)

module.exports = router