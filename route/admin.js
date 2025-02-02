const{Router}= require("express")
const adminRouter = Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {JWT_ADMIN_PASSWORD} = require("../config")
const { adminMiddleware } = require("../middleware/admin");




const{adminModel, courseModel} = require("../db");
adminRouter.post("/signup",async function(req,res){
    const { email , password , firstName , lastName} = req.body;
    
    const hasedPassword = await bcrypt.hash(password,5)
    adminModel.create({
        email:email,
        password:hasedPassword,
        firstName:firstName,
        lastName:lastName
    })
    
    res.json({
        message :"singup succeede"
    })

})
adminRouter.post("/signin",async function(req,res){
    const { email , password} = req.body;

    const response = await adminModel.findOne({
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
      },JWT_ADMIN_PASSWORD);
      res.json({
        token:token
      })
    }else{
        res.status(403).json({
            message:"incorrect credintial"
        })
    }

})
adminRouter.post("/course", adminMiddleware ,async function(req,res){
    const adminId =req.userId;
    const{ title , description, imageUrl, price} = req.body;
    const course = await courseModel.create({
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price,
        creatorId:adminId
    })
    res.json({
        message: "Course created",
        courseId: course._id
    })

})

adminRouter.put("/course", async function(req,res){
    const adminId = req.userId;

    const { title, description, imageUrl, price, courseId } = req.body;

    // creating a web3 saas in 6 hours
    const course = await courseModel.updateOne({
        _id: courseId, 
        creatorId: adminId 
    }, {
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price
    })

    res.json({
        message: "Course updated",
        courseId: course._id
    })

})
adminRouter.get("/course/bulk", async function(req,res){
    const adminId = req.userId;

    const courses = await courseModel.find({
        creatorId: adminId 
    });

    res.json({
        message: "Course updated",
        courses
    })

})
module.exports ={
    adminRouter: adminRouter
}