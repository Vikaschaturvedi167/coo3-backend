
const mongoose = require('mongoose');
// mongodb
const UserSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true,
  },
  coinBalance: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
