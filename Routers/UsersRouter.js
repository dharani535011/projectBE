const express=require("express")
const UserContoller = require("../Controllers/UserController")
const Verify = require("../Midleware/Verify")
const UserRouter=express.Router()

UserRouter.post("/register",UserContoller.registeration)
UserRouter.post("/login",UserContoller.login)
UserRouter.post("/forgetpassword",UserContoller.forgetpassword)
UserRouter.post("/ispassword",UserContoller.ispassword)
UserRouter.post("/logout",Verify.verify,UserContoller.logout)
UserRouter.post("/check",Verify.verify,UserContoller.check)
UserRouter.post("/edit",Verify.verify,UserContoller.edit)
UserRouter.post("/delete",Verify.verify,UserContoller.delete)
UserRouter.post("/review",Verify.verify,UserContoller.writereview)
UserRouter.post("/allusers",Verify.verify,UserContoller.getusers)
UserRouter.post("/allreview",UserContoller.getreviews)

module.exports=UserRouter