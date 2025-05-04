import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    creditBalance:{type:Number, default:5},
    otp: {type: String},
    otpExpiry: {type: Date},
    isVerified: {type: Boolean, default: false},
    passwordResetToken: {type: String},
    passwordResetExpiry: {type: Date}
})

const userModel=mongoose.models.user || mongoose.model("user",userSchema)

export default userModel;


