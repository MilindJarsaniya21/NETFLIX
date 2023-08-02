const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    userName: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    planName: {
        type: String,
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'plans'
    },
    purchaseDate: {
        type: Date, default: Date.now()
    },
    dueDate: {
        type: Date
    },
    isActive: {
        type: Boolean, default: true
    }
})

module.exports = mongoose.model('subscriptions', planSchema);