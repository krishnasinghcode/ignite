import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import connectDB from "./db.js";
const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;
async function startServer(){
    try{
        await connectDB(MONGODB_URI);

        app.listen(PORT,()=>{
            console.log(`server is listening on port: ${PORT}`);
        })
    }
    catch(err){
        console.error("Error starting server:",err.message);
        process.exit(1);
    }
}

startServer();