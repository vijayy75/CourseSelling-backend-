require('dotenv').config()
const express = require("express");
const jwt = require("jsonwebtoken");
const {userRouter} = require("./route/user")
const { courseRouter} = require("./route/course")
const {adminRouter} = require("./route/admin");
const { default: mongoose } = require('mongoose');

const app = express();
app.use(express.json());
app.use("/api/v1/user",userRouter);
app.use("/api/v1/course",courseRouter)
app.use("/api/v1/admin" , adminRouter)

async function main() {
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000);
    console.log("listening on port 3000")
}


main()