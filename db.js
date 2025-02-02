const mongoose = require("mongoose")
console.log("conncected to")
//const { Schema , default: mongoose } = require("mongoose")
mongoose.connect(process.env.Mongo_URL)
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;




const userSchema = new Schema({
     email:{ type: String, unique: true},
     password: String,
     firstName: String,
     lastName: String
})
const adminSchema = new Schema ({
    email:{ type: String, unique: true},
     password: String,
     firstName: String,
     lastName: String
})

const courseSchema = new Schema({
    title:String,
    descripation:String,
    price:Number,
    creatorId: ObjectId
})
const purchaseSchema = new Schema({
    userId:ObjectId,
    courseId:ObjectId
})
const userModel = mongoose.model("user",userSchema);
const adminModel = mongoose.model("admin",adminSchema);
const courseModel = mongoose.model("course",courseSchema);
const purchaseModel = mongoose.model("purchase",purchaseSchema);

module.exports={
    userModel,
    adminModel,
    courseModel,
    purchaseModel
}