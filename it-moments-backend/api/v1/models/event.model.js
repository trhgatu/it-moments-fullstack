import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    location: String,
    status: String,
    votingStartTime : {
        type: Date
    },
    votingEndTime: {
        type: Date
    },
    createdBy: {
        account_id: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    deleted: {
        type: Boolean,
        default: false
    },
},{
    timestamps: true,
})


const Event = mongoose.model('Event', eventSchema, 'events');

export default Event;
