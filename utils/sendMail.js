const nodemailer = require("nodemailer");
require("dotenv").config()



const sendMail = async (from, to, subject, body) => {
    try {
        const transporter = nodemailer.createTransport(
            {
                host: process.env.MAIL_HOST,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASSWORD
                }
            }
        )

        const mail_info = await transporter.sendMail(
            {
                from: from,
                to: to,
                subject: subject,
                html: body
            }
        )



        return true
    }

    catch (error) {
        console.log("error occured while sending a mail");
        console.log(error)
        return false
    }
}


module.exports = sendMail