import mongoose from "mongoose";
import ENV_VARS from "./utils/envars.js";

 const connectDB = async ()=>{
    try {
        await mongoose.connect(ENV_VARS.MONGO_URI)
        console.log("database connected successfully")
    } catch (error) {
        console.log(`Error connecting to database ${error}`)
        process.exit(1)
    }
}

export default connectDB