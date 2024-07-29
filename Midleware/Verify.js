const jwt=require("jsonwebtoken")
const { SECRETKEY } = require("../config")
const User = require("../Models/UsersModel")
const verify=async(req,res,next)=>{
try{
    const token = req.cookies["authtoken"]
   if(!token){
    return res.send({message:"please login"})
}
   const decoded=jwt.verify(token,SECRETKEY)
   const user=await User.findById(decoded.id,{password:0})
   if(!user){
    return res.send({message:"user is not found"})
   }
//    console.log(user._id)
   req.user=user
   next()
}catch(e){
    res.send({message:e.message})
}
}
module.exports={
    verify
}