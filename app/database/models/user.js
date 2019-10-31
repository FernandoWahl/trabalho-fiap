const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  group: { type: String, enum: ['admin', 'default', 'device'], default: 'default', required: true },
  date: { type: Date, default: Date.now },
  password: { type: String, select: false, required: true },
}, { versionKey: false })
module.exports = mongoose.model('User', userSchema);