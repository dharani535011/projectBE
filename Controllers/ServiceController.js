const { PASSWORD } = require("../config")
const Service = require("../Models/ServicesModel")
const User = require("../Models/UsersModel")
const nodemailer=require("nodemailer")
const moment = require('moment')
const ServiceController={
      bookservice:async(req,res)=>{
        const {carmodel,vehicleno,email,phone,service,user}=req.body
        try {
            const appdate=moment().add(3,"days")
            if(!carmodel||!vehicleno||!email||!phone||!service||!user){
                return res.send({message:"value is missing"})
            }
            const id=await User.findById(user)
            if(!id){
                return res.send({message:"user not found"})
            }

            const serve= new Service({
                   carmodel,vehicleno,email,phone,service,user,appointmentdate:moment(appdate.format('YYYY-MM-DDTHH:mm:ss.SSSZ')).toDate()
            })
          const val=  await serve.save()
            id.servicehistory.push(val._id)
            await id.save()
            
           const transport=nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:"dharani535011@gmail.com",
                pass:PASSWORD
            }
           })
           transport.sendMail({
            from:"dharani535011@gmail.com",
            to:val.email,
            subject:"Appointment Booked In DD Services",
            text:`  Your are booked the appointment in DD Services 
                       Detials:=>
                        service          : ${val.service}
                        phone No         : ${val.phone}
                        Email            : ${val.email}
                        Booked Date      : ${moment().calendar()}
                    your appointment date is ${appdate.format('MM/DD/YYYY')}
                    
                    for more detials call: 8956244768
                    `
            
           })
            res.send({message:"Appointment booked"})
        } catch (error) {
            res.send({message:error.message})
        }
      },
      appointments:async(req,res)=>{
        const {id}=req.body
        try {
            if(!id){
                return res.send({message:"user not found"})
            }
            const users=await Service.find({
                appointmentdate:{
                    $gt:moment().toDate()
                },user:id
            })
            res.send({message:users})
        } catch (error) {
            res.send({message:error.message})
        }
      },
      userhistory:async(req,res)=>{
        const user=req.user
        try {
            const history=await Service.find({user:user._id})
            res.send({message:history})
        } catch (error) {
            res.send({message:error.message})
        }
      },
      vehicleexpense:async(req,res)=>{
        const user=req.user
        try {
            const history=await Service.aggregate([
                {
                    $match:{user:user._id}
                },
                {
                    $group:{
                        _id:"$service",
                        count:{$sum:1}
                    }
                }
            ])
            res.send({message:history})

        } catch (error) {
            res.send({message:error.message})
        }
      }
}
module.exports=ServiceController