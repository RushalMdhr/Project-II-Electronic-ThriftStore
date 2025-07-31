import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
    name :{
        type:String,
        trim:true,
        required:true,
        maxlength:32,
        unique:true
    },
    used : {
        type:Number,
        default:0
    }
})

export default mongoose.model("Category",categorySchema)