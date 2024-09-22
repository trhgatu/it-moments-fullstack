import mongoose from "mongoose";
import generate from "../../../helpers/generate";


const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: generate.generateRandomString(20)
    },
    phone: String,
    avatar: String,
    deleted: {
        type: Boolean,
        default: false
    },

    deletedAt: Date,
}, {
    timestamps: true
})
const User = mongoose.model('User', userSchema, 'users')

export default User
