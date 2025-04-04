const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: Number.isFinite,
      message: '{VALUE} is not a valid price'
    }
  },
  duration: {
    type: Number,
    required: [true, 'Service duration is required'],
    min: [15, 'Minimum service duration is 15 minutes']
  },
  category: {
    type: String,
    trim: true
  },
  image: {
    type: String // URL to image
  },
  active: {
    type: Boolean,
    default: true
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

// Add an index for faster lookups by category
ServiceSchema.index({ category: 1 });

module.exports = mongoose.model('Service', ServiceSchema);