import express from "express"
import dotenv from 'dotenv'
import { db } from "./dbconfig/db.js"
import cookieParser from 'cookie-parser'
import  authRoutes  from './routes/auth.route.js'
import cors from "cors";

dotenv.config()  // if you use env variable always to config to call 
const app=express()
const PORT=process.env.PORT || 5000;
// Middleware to handle CORS
app.use(cors());

app.use(cookieParser())
app.use(express.json()) //  allows us to parse incoming request to :req.body in json formate

app.use('/api/auth',authRoutes)


app.listen(PORT, () => {
    try{
        db();
        console.log(`Server is running on port ${PORT}`);
    }catch(err){
        console.log("error in connection",err.message)
    }
});
