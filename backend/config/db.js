import mongoose from "mongoose";

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.DATABASE_URI)
        console.log(`Connection Sucessful ✅`);
        
    } catch (error) {
        console.log(`error ❌ : ${error}`);
        process.exit(1);
    }
}

export default connectDB;