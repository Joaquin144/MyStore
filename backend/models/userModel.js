const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please enter your name"],
        maxLength:[30,"Namm bade aur darshan chote"],
        minLength: [3,"Bhai isse chota naam hai toh nahi ho payega."]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"],
      },
      password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be greater than or equal to 8 characters"],
        select: false,//When admin will apply find op on User each document of User Collection, this particular field won't be fetched. [We do this for security purpose obviously]
      },
      avatar: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
      role: {
        type: String,
        default: "user",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    
      resetPasswordToken: String,
      resetPasswordExpire: Date,
});

//Before save event from happening we want to hash the password for security reasons
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();//No need to encrypt/decrypt pswd since user has not changed his pswd
    }
    this.password = await bcrypt.hash(this.password,10);//10 stands for power --> Powerful hashes are difficult to crack but will consume more reosurces too.

})

//JWT Token --> so that user does not needs to login again and again. We will store this token in cookie
userSchema.methods.getJWTToken = function (){
    //MongoDB automatically creates this _id field
    return jwt.sign({id:this._id},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRE}
    );//Always keep JWT key a secret otherwise intruder can create any numer of fake admin accounts 😱
}

//Compare pswds
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}


//Generate pswd reset token for changing the pswd
userSchema.methods.getResetPasswordToken = function(){
  //Step 1: generate token:---
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Step 2: hashing and adding to userSchema
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");//this means the userModel ka object(document) that got created

  this.resetPasswordExpire = Date.now() + 15*60*1000;
  return resetToken;
}




module.exports = mongoose.model("User",userSchema);