require("dotenv").config()
const MONGO=process.env.MONGO
const SECRETKEY=process.env.SECRETKEY
const PORT=process.env.PORT
const PASSWORD=process.env.PASSWORD
const STRIPE_SECRET_KEY=process.env.STRIPE_SECRET_KEY
module.exports={
    MONGO,SECRETKEY,PORT,PASSWORD,STRIPE_SECRET_KEY
}