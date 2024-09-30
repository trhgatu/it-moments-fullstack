import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: String,
    phone: String,
    avatar: String,
    deleted: {
        type: Boolean,
        default: false
    },
    role_id: String,
    status: String,
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
