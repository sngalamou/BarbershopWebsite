const Service = require('../models/Service');
const { validationResult } = require('express-validator');

// @route   GET api/services
// @desc    Get all services
// @access  Public
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ price: 1 });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/services
// @desc    Create a new service
// @access  Private/Admin
exports.createService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, description, duration, price } = req.body;

  try {
    const newService = new Service({
      name,
      description,
      duration,
      price
    });

    const service = await newService.save();
    res.json(service);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/services/:id
// @desc    Update a service
// @access  Private/Admin
exports.updateService = async (req, res) => {
  // Implementation logic
};

// @route   DELETE api/services/:id
// @desc    Delete a service
// @access  Private/Admin
exports.deleteService = async (req, res) => {
  // Implementation logic
};