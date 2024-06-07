require('dotenv').config();
const express =require('express');
const app=express();
const path =require('path');
const mongoose=require('mongoose');
const userRoutes =require('./routes/user')
const pollRoutes=require('./routes/poll');
const feedbackRoutes=require('./routes/Feedback')
const DemoRoutes=require('./routes/Demo')
const cors=require('cors');
const jwt = require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const bodyParser = require('body-parser');


app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: '*', // Allow all origins
  credentials: true // Allow cookies to be sent
}));




mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("database connected")
})





app.use("/api/user",userRoutes)
app.use("/api/poll",pollRoutes)
app.use("/api/feedback",feedbackRoutes);
app.use("/api/demopoll",DemoRoutes);



app.listen(3001,()=>{
    console.log("serving on port 3001")
})