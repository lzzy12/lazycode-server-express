import mongoose, { Schema } from "mongoose";

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var validateUrl = function(url) {
    var re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    return re.test(url);
}
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email must be provided for user creation'],
        validate: [validateEmail, 'Please fill a valid email address'],
    },
    providerId: {
        type: String,
        required: 'Provider ID must be provider',
    },
    photo: {
        type: String,
        validate: [validateUrl, 'Must be a valid URL']  
    },
    provider: {
        type: String,
        required: true,
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