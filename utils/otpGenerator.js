const OTPgenerator = require("otp-generator");



const generateOTP = () => {
    const otp = OTPgenerator.generate(4,
        {
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        }
    )

    return otp
}

module.exports = generateOTP