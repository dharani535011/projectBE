



const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const multer = require("multer");
const { MONGO, PORT, STRIPE_SECRET_KEY } = require("./config");
const UserRouter = require("./Routers/UsersRouter");
const User = require("./Models/UsersModel");
const ServiceRouter = require("./Routers/ServiceRouter");
const moment = require("moment");
const Stripe = require('stripe');


const stripe = Stripe(STRIPE_SECRET_KEY);

app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, "uploads")));


const allowedDomains = ['https://stupendous-taffy-488b03.netlify.app', 'http://localhost:5173',"https://incomparable-sherbet-461c12.netlify.app","https://magical-kheer-0ce23a.netlify.app"];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedDomains.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use("/user", UserRouter);
app.use("/service", ServiceRouter);

// Photo upload code
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

app.post("/upload", upload.single("file"), async (req, res) => {
    const { id } = req.body;
    try {
        if (!id) {
            return res.status(400).send({ message: "Id required" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        // Delete the previous image if it exists
        if (user.image && fs.existsSync(user.image)) {
            fs.unlink(user.image, (err) => {
                if (err) {
                    console.error("Error deleting the file:", err);
                    return res.status(500).send({ message: "Error deleting the previous file" });
                }
            });
        }

        // Save the new image path
        user.image = req.file.path;
        await user.save();

        res.send({ message: "Photo uploaded" });
    } catch (error) {
        console.error("Error during file upload:", error);
        res.status(500).send({ message: error.message });
    }
});

// Payment intent creation
app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'inr',
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).send({
            error: error.message,
        });
    }
});

console.log(moment().toDate());
const port = 3000;
mongoose.connect(MONGO)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    });
