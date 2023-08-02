const mongoose = require('mongoose');
const planSchema = new mongoose.Schema({
    planName: String,
    duration: Number,
    totalPrice: Number,
    resolution: String,
    videoQuality: String,
    supporetdDevices: String,
})

module.exports = mongoose.model('plans', planSchema);