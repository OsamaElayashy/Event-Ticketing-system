const mongoose = require("mongoose")

const EventSchema = new mongoose.Schema( {
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    Date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    ticketPrice: {
        type: Number,
        required: true
    },
    totaltickets: {
        type: Number,
        required: true
    },
    remainingTickets: {
        type: Number,
        required: true,
        default: function () { return this.totalTickets; } 
    },
    Organizer: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['approved', 'pending', 'declined'],
        required: true 
    }

},  { timestamps: true}
);
module.exports = mongoose.model("Event", EventSchema);
