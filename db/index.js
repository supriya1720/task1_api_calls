const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://navu1517:supiscute@lms.9k1fy.mongodb.net/assignment");

const   UserSchema = new mongoose.Schema({
    username:{ type: String, required: true, unique: true },
    password:{ type: String, required: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
});

const User = mongoose.model ('User',UserSchema);

module.exports = {User};