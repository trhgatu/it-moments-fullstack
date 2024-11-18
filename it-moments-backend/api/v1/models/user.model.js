import mongoose from "mongoose";
import slug from 'mongoose-slug-updater';

mongoose.plugin(slug);

const userSchema = new mongoose.Schema({
    fullName: String,
    isAdmin : Boolean,
    email: String,
    password: String,
    token: String,
    refreshToken: String,
    verificationToken: String,
    slug: {
        type: String,
        slug: "fullName",
        unique: true
    },
    bio: {
        type: String,
        default: ''
    },
    socialLinks: {
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        instagram: { type: String, default: '' },
        youtube: { type: String, default: '' },
    },
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
