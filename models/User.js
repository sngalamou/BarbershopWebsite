const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?(\d{10,14})$/, 'Please enter a valid phone number']
  },
  role: {
    type: String,
    enum: {
      values: ['client', 'admin', 'manager'],
      message: '{VALUE} is not a valid role'
    },
    default: 'client'
  },
  preferredStaff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  dateJoined: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add an index for faster lookups by category
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

// User Model
module.exports = mongoose.model('User', UserSchema);