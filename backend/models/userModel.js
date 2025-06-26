import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username : {
        type : String,
        required : true
    },

    email : {
        type : String,
        required : true,
        unique : true
    },

    password : {
        type : String,
        required : true
    },
    isUser: {
        type : Boolean,
        required : true,
        default : true,
    },
    isVendor: {
        type : Boolean,
        required : true,
        default : false,
    },

    isAdmin: {
        type : Boolean,
        required : true,
        default : false,
    }
},{
    timestamps : true //when we create or delete a user it will give the specific time
});

const User = mongoose.model('User',userSchema);

export default User;