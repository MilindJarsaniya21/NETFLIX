const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    uName: String,
    uEmail: String,
    uPassword: String,
    role: {type: String, enum: ['User', 'Admin'], default: 'User'},
})

module.exports = mongoose.model('user', userSchema);