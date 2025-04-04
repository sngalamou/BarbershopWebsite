const Appointment = require('../models/Appointment');
const { validationResult } = require('express-validator');

// @route   GET api/appointments
// @desc    Get all appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('client', 'name email')
      .populate('staff', 'name')
      .populate('service', 'name duration price');
    
    res.json(appointments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST api/appointments
// @desc    Create a new appointment
// @access  Private
exports.createAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { client, staff, service, date, time, status } = req.body;

  try {
    const newAppointment = new Appointment({
      client,
      staff,
      service,
      date,
      time,
      status
    });

    const appointment = await newAppointment.save();
    res.json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT api/appointments/:id
// @desc    Update an appointment
// @access  Private
exports.updateAppointment = async (req, res) => {
  // Implementation logic
};

// @route   DELETE api/appointments/:id
// @desc    Delete an appointment
// @access  Private
exports.deleteAppointment = async (req, res) => {
  // Implementation logic
};