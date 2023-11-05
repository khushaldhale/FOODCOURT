const express = require("express");
const app = express();
require("dotenv").config()



app.use(express.json())

const cors = require("cors");
app.use(cors(
    {
        origin: "http://localhost:3000"
    }
))

const cookies = require("cookie-parser");
app.use(cookies())

const files = require("express-fileupload");

app.use(files(
    {
        useTempFiles: true,
        tempFileDir: "/tmp/"   // we may have error here 
    }
))


const rate_limit = require("express-rate-limit");
const limiter = rate_limit(
    {
        windowMs: 60 * 60 * 1000,
        max: 100
    }
)

app.use(limiter)



app.get("/", (req, res, next) => {
    return res.status(200)
        .json(
            {
                success: false,
                message: 'server is up and running'
            }
        )
})

const dbConnect = require("./config/database");
dbConnect()


app.use((error, req, res, next) => {
    console.log(error);
    return res.status(error.statusCode || 500)
        .json(
            {
                success: false,
                message: error.message
            }
        )
})


const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log("server started at ", PORT)
})

process.on("SIGINT", () => {
    server.close(() => {
        console.log("I am shutting down the server")
    })
})