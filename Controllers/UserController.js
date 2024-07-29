const User = require("../Models/UsersModel")
const bcrypt=require("bcrypt")
const crypto=require("crypto")
const jwt =require("jsonwebtoken")
const { SECRETKEY, PASSWORD } = require("../config")
const nodemailer=require("nodemailer")
const Service = require("../Models/ServicesModel")
const UserContoller={
    //   registeration
    registeration:async(req,res)=>{
         const {name,password,email,phone}=req.body
         try{
            const users=await User.findOne({email})
            if(users){
                return res.send({message:"user is already existed"})
            }
            if(!name||!password||!phone){
                return res.send({message:"value is not existed"})
            }
            const hasshed=await bcrypt.hash(password,10)
            const user=new User({name,password:hasshed,email,phone})
            await user.save()
           res.send({message:"user registered successfully"})
         }catch(e){
             res.send({message:e.message})
         }
        },
        // login
        login:async(req,res)=>{
            const {email,password}=req.body
            try{
                if(!email){
                    return res.send({message:"user is not found"})
                }
                const users=await User.findOne({email})
                if(!users){
                    return res.send({message:"user is not found"})
                }
                const pass=await bcrypt.compare(password,users.password)
                if(!pass){
                    return res.send({message:"Worng Password"})
                }
                const token =jwt.sign({id:users._id},SECRETKEY,{expiresIn:"1d"})
                // res.setHeader('x-auth-token', token)
                res.cookie("authtoken",token,{
                    httpOnly:true,
                    secure:true,
                    sameSite:"none",
                    maxAge: 24 * 60 * 60 * 1000
                })
                res.send({
                    message:"login successfully"
                })
            }catch(e){
                res.send({message:e.message})
            }
        },
        // forget pass
        forgetpassword:async(req,res)=>{
          const {email}=req.body
          try{
            const users=await User.findOne({email})
            if(!users){
                return res.send({message:"user is not found"})
            }
             const random=crypto.randomBytes(6).toString("hex").slice(0,6)
             users.otp=random
             await users.save()
             let transport=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"dharani535011@gmail.com",
                pass:PASSWORD
            }
          })
            transport.sendMail({
            from:"dharani535011@gmail.com",
            to:users.email,
            subject:"password reset OTP",
            text:`change your password to use this otp : ${random}`
          })
          res.send({message:"OTP send to your mail.."})
          }catch(e){
            res.send({message:e.message})
          }
        },
        // ispassword
        ispassword:async(req,res)=>{
            const {otp,password}=req.body
            try {
                const users=await User.findOne({otp})
            if(!users){
                return res.send({message:"worng otp"})
            }
            if(!password){
                return res.send({message:"password is required"})
            }
            const hasshed=await bcrypt.hash(password,10)
            users.password=hasshed
            users.otp=""
            await users.save()
            res.send({message:"password changed sucessfully"})
            } catch (e) {
                res.send({message:e.message})
            }
        },
        check:(req,res)=>{
            const token=req.cookies["authtoken"]
            const user=req.user
            if(!token){
                return  res.send("ex")
            }
            res.send({user,message:"valid"})
        },
        // logout
        logout:async(req,res)=>{
            try {
                // res.cookie("authtoken","",{maxAge:0})
                res.clearCookie("authtoken")
                res.send({ message: 'Logout successful' })
            } catch (error) {
                res.send({message:error.message})
            }
        },
        edit:async(req,res)=>{
            const {email,phone,userid}=req.body
            try {
                if(!email||!phone){
                    return res.send({message:"email or phone number is required"})
                }
              const user= await User.findById(userid)
              user.email=email
              user.phone=phone
              await user.save()
              res.send({message:"profile updated"})
            } catch (error) {
                res.send({message:error.message})
            }
        },
        delete:async(req,res)=>{
            const {id}=req.body
            try {
                if(!id){
                    return res.send({message:"Id number is required"})
                }
                
               const users= await User.findById(id)
               if(!users){
                return res.send({message:"user is not found"})
            }
            await Service.deleteMany({user:id})
                await User.findByIdAndDelete(users._id)
                res.send({message:"user deleted"})
            } catch (error) {
                res.send({message:error.message})
            }
        },
        getusers:async(req,res)=>{
            try {
                // const user=req.user
                // if(!user){
                //     return res.send({message:"user not found"})
                // }
                const users=await User.find({},{password:0})
                res.send(users)
            } catch (error) {
                res.send({message:error.message})
            }
        },
        getreviews:async(req,res)=>{
            try {
                // const user=req.user
                // if(!user){
                //     return res.send({message:"user not found"})
                // }
                const users=await User.find({},{review:1,name:1}).limit(10)
                res.send(users)
            } catch (error) {
                res.send({message:error.message})
            }
        }
        ,
        writereview:async(req,res)=>{
            const {rating,review,userid}=req.body
            try {
                if(!rating||!review){
                    return res.send({message:"review or rating is required"})
                }
                const user=await User.findById(userid)
                if(!user){
                    return res.send({message:"user not found"})
                }
                user.rating=rating
                user.review=review
                await user.save()
                res.send({message:"thanks for your ratings"})
            } catch (error) {
                res.send({message:error.message})
            }
        },
      
}
module.exports=UserContoller