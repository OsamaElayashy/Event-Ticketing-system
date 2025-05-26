const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema( {
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    profilePicture: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["StandardUser" , "Organizer" , "Admin"],
        required: true
    },
    resetToken: {
        type: String
    },
    resetTokenExpiry: {
        type: Date
    }
},  { timestamps: true}
);

//Mongoose Model
const User = mongoose.model("User" , UserSchema);
module.exports = User;

