import mongoose from "mongoose";

async function connectDB(uri){
    try{
        await mongoose.connect(uri);
        console.log("DB connected successfully");
    }
    catch(err){
        console.error("Error Connecting to DB:",err.message);
        process.exit(1);
    }
}

export default connectDB;