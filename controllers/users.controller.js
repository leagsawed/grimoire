const bcrypt = require('bcrypt');
const { User } = require('../models/User.js');
const jwt = require('jsonwebtoken');

async function signUp(req, res) {
  const body = req.body;
  const email = body.email;
  const password = body.password;

  if (!email || !password || email.trim() === '' || password.trim() === '') {
    res.status(400).send('Email et mot de passe requis');
    return;
  }

  try {
    const user = new User({
      email: email.trim(),
      password: hashPassword(password),
    });

    await user.save();
    res.send('Utilisateur créé');
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).send('Email déjà existant');
    } else {
      console.error(error);
      res.status(500).send('Il y a eu un problème');
    }
  }
}

async function logIn(req, res) {
  const body = req.body;
  const email = body.email;

  if (email == null || body.password == null) {
    res.status(400).send('Email et mot de passe requis');
    return;
  }

  const userInDb = await User.findOne({
    email: email.trim(),
  });

  if (userInDb == null) {
    res.status(401).send('Email non valide');
    return;
  }
  const passwordInDb = userInDb.password;
  if (!isPasswordCorrect(body.password, passwordInDb)) {
    res.status(401).send('Mot de passe non valide');
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

function hashPassword(password) {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  return hash;
}

function isPasswordCorrect(password, hash) {
  return bcrypt.compareSync(password, hash);
}

module.exports = { signUp, logIn };
