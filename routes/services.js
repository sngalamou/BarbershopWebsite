const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const serviceController = require('../controllers/serviceController');

// @route   GET api/services
// @desc    Get all services
// @access  Public
router.get('/', serviceController.getServices);

// @route   POST api/services
// @desc    Create a new service
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('duration', 'Duration must be a number').isNumeric(),
      check('price', 'Price must be a number').isNumeric()
    ]
  ],
  serviceController.createService
);

// @route   PUT api/services/:id
// @desc    Update a service
// @access  Private/Admin
router.put('/:id', auth, serviceController.updateService);

// @route   DELETE api/services/:id
// @desc    Delete a service
// @access  Private/Admin
router.delete('/:id', auth, serviceController.deleteService);

module.exports = router;