import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    votingStartTime: {
        type: Date
    },
    votingEndTime: {
        type: Date
    },
    createdBy: {
        account_id: {
            type: String,
            required: true
        },
        fullName: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    deleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
});

const Event = mongoose.model('Event', eventSchema, 'events');

export default Event;
