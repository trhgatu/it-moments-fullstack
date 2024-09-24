import mongoose from "mongoose";
import { generateRandomString } from "../../../helpers/generate.js";

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: generateRandomString(20)
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
