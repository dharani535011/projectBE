const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:String,
    role:{type:String,default:"user"},
    email:String,
    password:String,
    phone:Number,
    otp:String,
    servicehistory:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    createdAt: { type: Date, default: Date.now },
    image: {
        type: String,
        default: ""
    },
    rating:{
        type: Number,
        default: 0
    },
    review:{
        type: String,
        default: ""
    }
})
const User=mongoose.model("User",userSchema,"users")
module.exports=User