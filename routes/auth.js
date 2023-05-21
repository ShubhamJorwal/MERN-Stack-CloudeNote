const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const fetchuser = require('../middlewares/Fetchuser');
const JWTsec = "hlooo$fhalks"

// Route : 1  create a user using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
  body('name', "enter a valid name").isLength({ min: 5 }),
  body('email', "enter a valid email").isEmail(),
  body('password', "password must be atleast 5 char").isLength({ min: 5 }),
], async (req, res) => {
  let success = false;
  // if there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {

    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    console.log(user)
    if (user) {
      return res.status(400).json({ success, error: "Sorry a user with this email already exists" })
    }

    const salt = await bcrypt.genSalt(10)
    secPass = await bcrypt.hash(req.body.password, salt);
    // create a new user
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    });

    const data = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, JWTsec)

    success =true
    res.json({ success, authToken })
    // res.json(user)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some error occured");
  }

})

// Route : 2  Authenticate a user using: POST "/api.auth/login". No login required

router.post('/login', [
  body('email', "enter a valid email").isEmail(),
  body('password', "password cannot be blank").exists(),
], async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      success = false;
      return res.status(400).json({ error: "Please try to login with right Credentials" })
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({  error: "Please try to login with right Credentials" })
    }
    const data = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, JWTsec);
    success = true;
    res.json({ success, authToken })


  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
})





// Route : 3  Get loggedin user Details using: POST "/api.auth/getuser". login required
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
})
module.exports = router 