const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const auth = require('../middleware/auth');
const staffController = require('../controllers/staffController');

// @route   GET api/staff
// @desc    Get all staff members
// @access  Public
router.get('/', staffController.getStaffMembers);

// @route   GET api/staff/:id
// @desc    Get staff member by ID
// @access  Public
router.get('/:id', staffController.getStaffMember);

// @route   POST api/staff
// @desc    Create a staff member
// @access  Private/Admin
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty(),
      check('title', 'Title is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail()
    ]
  ],
  staffController.createStaffMember
);

// @route   PUT api/staff/:id
// @desc    Update a staff member
// @access  Private/Admin
router.put('/:id', auth, staffController.updateStaffMember);

// @route   DELETE api/staff/:id
// @desc    Delete a staff member
// @access  Private/Admin
router.delete('/:id', auth, staffController.deleteStaffMember);

module.exports = router;