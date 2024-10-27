import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: String,
    isAdmin : Boolean,
    email: String,
    password: String,
    token: String,
    refreshToken: String,
    verificationToken: String,
    isVerified: { type: Boolean, default: false },
    phone: String,
    avatar: String,
    deleted: {
        type: Boolean,
        default: false
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    status: {
        type: String,
        default: "active"
    },
    deletedAt: Date,
}, {
    timestamps: true
})
const User = mongoose.model('User', userSchema, 'users')

export default User
