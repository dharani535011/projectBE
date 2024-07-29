const ServiceController = require("../Controllers/ServiceController")
const Verify = require("../Midleware/Verify")
const express=require("express")
const ServiceRouter=express.Router()

ServiceRouter.post("/book",Verify.verify,ServiceController.bookservice)
ServiceRouter.post("/appointment",Verify.verify,ServiceController.appointments)
ServiceRouter.post("/history",Verify.verify,ServiceController.userhistory)
ServiceRouter.post("/vehiclehistory",Verify.verify,ServiceController.vehicleexpense)

module.exports=ServiceRouter