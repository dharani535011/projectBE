const mongoose=require("mongoose")
const { Schema } = mongoose

const servicesSchema=new mongoose.Schema({
    carmodel:String,
    vehicleno:String,
    email:String,
    phone:Number,
    service: String,
    createdat:{type:Date,default:Date.now},
    user:{type:Schema.Types.ObjectId,ref:"User"},
    appointmentdate:{
        type:Date,
        default:""
    }
})
const Service=mongoose.model("Service",servicesSchema,"services")
module.exports=Service