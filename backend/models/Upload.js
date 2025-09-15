const mongoose = require('mongoose');
const UploadSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: String,
  originalName: String,
  columns: [String],
  data: { type: Array },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Upload', UploadSchema);
