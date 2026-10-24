
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  rollNo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  cgpa: {
    type: Number,
    required: true,
    min: 0,
    max: 10,
  },
  contact: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Student', studentSchema);
