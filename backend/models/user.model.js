import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
    },
    gender : {
        type: String,
        required: [true, "Please provide "],
        enum: ['male' , 'female']
    },
    profilePic: {
        type: String,
        default: "",
    },
    refreshToken : {
        type : String
    }
} , {timestamps : true});

UserSchema.pre("save" ,async function(next){
    if(!this.isModified("password")){
        return next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(this.password , salt);
    next();
});

UserSchema.methods.isPasswordCorrect = async function (password){
    return bcrypt.compareSync(password , this.password);
}

UserSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id : this._id,
        email : this.email,
        username : this.username,
        name : this.name
    } , process.env.ACCESS_TOKEN_SECRET , {expiresIn : process.env.ACCESS_TOKEN_EXPIRY});
}

UserSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id : this._id
    } , process.env.REFRESH_TOKEN_SECRET , {expiresIn : process.env.REFRESH_TOKEN_EXPIRY});
}

const User = mongoose.model("User", UserSchema);

export default User;