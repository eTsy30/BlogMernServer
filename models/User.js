import mongoose from "mongoose";

const userShema= new mongoose.Schema({
    fullName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    avatarUrl:String
},{timestamps:true})
export default mongoose.model('User',userShema)