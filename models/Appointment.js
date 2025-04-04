const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(v) {
        return v > new Date(); // Ensure appointment is in the future
      },
      message: 'Appointment date must be in the future'
    }
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required'],
    validate: {
      validator: function(v) {
        return v > new Time(); // Ensure appointment is in the future
      },
      message: 'Appointment time must be in the future'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'],
      message: '{VALUE} is not a valid status'
    },
    default: 'scheduled'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for faster queries
AppointmentSchema.index({ date: 1 });
AppointmentSchema.index({ staff: 1 });
AppointmentSchema.index({ client: 1 });

module.exports = mongoose.model('Appointment', AppointmentSchema);