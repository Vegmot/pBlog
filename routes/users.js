// what routes/users.js does is
// to register a user
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const { check, validationResult } = require('express-validator');

const User = require('../models/User');

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post(
  '/',
  [
    check('firstName', 'Please enter your first name').not().isEmpty(),
    check('lastName', 'Please enter your last name').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password should be at least 6 characters').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // if there is any error
      return res.status(400).json({ errors: errors.array() });
    }

    let { firstName, lastName } = req.body;
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // change user's name with proper capitalisation
      firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

      // create a new user profile
      user = new User({
        firstName,
        lastName,
        email,
        password,
      });

      // generate salt and hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // and then save the user with the hashed password
      await user.save();

      // get the unique id of the authorised user
      const payload = {
        user: {
          id: user.id,
        },
      };

      // and get the user logged in
      jwt.sign(
        payload,
        process.env.JWTSECRET,
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
