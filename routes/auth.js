const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../User');
const router = express.Router();

// Sign-up route
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.send('Sign-up successful');
  } catch (error) {
    res.status(500).send('Sign-up failed');
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    res.send('Login successful');
  } else {
    res.status(401).send('Login failed');
  }
});

// Logout route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Logout failed');
    }
    res.send('Logout successful');
  });
});

module.exports = router;
