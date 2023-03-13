const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    message: String,
    createdAt: { type: Date, default: Date.now },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    }
    
})

module.exports = mongoose.model('Notification', NotificationSchema);