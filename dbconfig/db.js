import mongoose from "mongoose";


export const db=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongodb is connected  ${conn.connection.host}`);

    }
    catch(err){
        console.log("connection to mongoDB error",err.message)
        process.exit(1) //1 is failure ,0 statuscode is success
    }
}