import mongoose, { Schema } from "mongoose";

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email must be provided for user creation'],
        validate: [validateEmail, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, 'User must have a password'],
    },
    userActive: {
        type: Boolean,
        default: true,
    },
    lastActive: {
        type: Date,
        default: Date.now
    },
})

export const User = mongoose.model('User', userSchema);