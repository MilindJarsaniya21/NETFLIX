const mongoose = require('mongoose');
const videoSchema = new mongoose.Schema({
    videoTitle: String,
    videoName: String,
    videoRes: String,
    planId: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'plans',
    }]
})

module.exports = mongoose.model('videos', videoSchema);