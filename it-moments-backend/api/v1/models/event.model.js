import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    start_time: {
        type: Date,
        required: true
    },
    end_time: {
        type: Date,
        required: true,
    },
    location: String,
    status: String,
    voting_start_time : {
        type: Date
    },
    voting_end_time: {
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
