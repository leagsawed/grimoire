const bcrypt = require('bcrypt');
const { User } = require('../models/User.js');
const jwt = require('jsonwebtoken');

const express = require('express');

const usersRouter = express.Router();
usersRouter.post('/signup', signUp);
usersRouter.post('/login', logIn);

async function signUp(req, res) {
  const body = req.body;
  const email = body.email;
  const password = body.password;

  if (!email || !password || email.trim() === '' || password.trim() === '') {
    res.status(400).send('Email and password are required');
    return;
  }

  try {
    const user = new User({
      email: email.trim(),
      password: hashPassword(password),
    });

    await user.save();
    res.send('User created');
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).send('Email already exists');
    } else {
      console.error(error);
      res.status(500).send('Something went wrong');
    }
  }
}

async function logIn(req, res) {
  const body = req.body;
  const email = body.email;

  if (email == null || body.password == null) {
    res.status(400).send('Email and password are required');
    return;
  }

  const userInDb = await User.findOne({
    email: email.trim(),
  });

  if (userInDb == null) {
    res.status(401).send('Wrong email');
    return;
  }
  const passwordInDb = userInDb.password;
  if (!isPasswordCorrect(body.password, passwordInDb)) {
    res.status(401).send('Wrong password');
    return;
  }
  function generateToken(userInDb) {
    const payload = { userId: userInDb };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return token;
  }

  res.send({
    userId: userInDb._id,
    token: generateToken(userInDb._id),
  });
}

//cryptage du password
function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

//Verification du password
function isPasswordCorrect(password, hash) {
  const isPasswordOk = bcrypt.compareSync(password, hash);
  return isPasswordOk;
}

module.exports = { usersRouter };

// User.deleteMany({}).then(() => {
//   console.log('users deleted');
// });
