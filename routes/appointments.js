const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const appointmentController = require('../controllers/appointmentController');

// @route   GET api/appointments
// @desc    Get all appointments
// @access  Private
router.get('/', auth, appointmentController.getAppointments);

// @route   POST api/appointments
// @desc    Create a new appointment
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('staff', 'Staff is required').not().isEmpty(),
      check('service', 'Service is required').not().isEmpty(),
      check('date', 'Date is required').not().isEmpty(),
      check('time', 'Time is required').not().isEmpty()
    ]
  ],
  appointmentController.createAppointment
);

// @route   PUT api/appointments/:id
// @desc    Update an appointment
// @access  Private
router.put('/:id', auth, appointmentController.updateAppointment);

// @route   DELETE api/appointments/:id
// @desc    Delete an appointment
// @access  Private
router.delete('/:id', auth, appointmentController.deleteAppointment);

module.exports = router;