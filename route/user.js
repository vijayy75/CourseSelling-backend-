const{ Router } = require("express");
const jwt = require("jsonwebtoken")
const {JWT_USER_PASSWORD}=("../config")
const bcrypt = require("bcrypt");
const{ z } = require("zod");
const { userModel } = require("../db");


const userRouter = Router();
userRouter.post("/signup", async function(req,res){
    const { email , password , firstName , lastName} = req.body;
    
    const hasedPassword = await bcrypt.hash(password,5)
    userModel.create({
        email:email,
        password:hasedPassword,
        firstName:firstName,
        lastName:lastName
    })
    
    res.json({
        message :"singup succeede"
    })

})

userRouter.post("/signin", async function(req,res){
    const { email , password} = req.body;

    const response = await userModel.findOne({
        email:email
    });
    if(!response){
        res.status(403).json({
            message:"user not found"
        })
    }
    const passwordMatch = await bcrypt.compare(password,response.password);
    
    if(passwordMatch){
      const token = jwt.sign({
        id: response._id.toString()
      },JWT_USER_PASSWORD);
      res.json({
        token:token
      })
    }else{
        res.status(403).json({
            message:"incorrect credintial"
        })
    }
})

userRouter.get("/purchases", async function(req,res){
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
        purchases,
        coursesData
    })

})

module.exports = {
    userRouter : userRouter
}