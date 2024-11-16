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
        enum: ["active", "inactive", "completed", "canceled"],
        default: "inactive",
    },
    votingStartTime: {
        type: Date,
        validate: {
            validator: function (v) {
                return v < this.endTime;
            },
            message: "Thời gian bình chọn phải trước khi sự kiện kết thúc.",
        },
    },
    votingEndTime: {
        type: Date,
        validate: {
            validator: function (v) {
                return v > this.votingStartTime && v <= this.endTime;
            },
            message: "Thời gian kết thúc bình chọn phải nằm trong khoảng thời gian sự kiện.",
        },
    },
    votingStatus: {
        type: String,
        enum: ['active', 'closed'],
    },
    createdBy: {
        account_id: String,
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
eventSchema.methods.updateVotingStatus = function () {
    const now = new Date();
    this.isVotingOpen =
        this.status === "active" &&
        this.votingStartTime <= now &&
        this.votingEndTime >= now;
};

const Event = mongoose.model('Event', eventSchema, 'events');

export default Event;
