const express = require('express');
const app = express();
const { User } = require('./db/mongo');
const cors = require('cors'); //Cross Origin Ressource Sharing,  permet de définir quelles origines peuvent accéder aux ressources du serveur
const bcrypt = require('bcrypt');

const PORT = 4000;

app.use(cors());
app.use(express.json());

function sayHello(req, res) {
  res.send('Hello World');
}

app.get('/', sayHello);

app.post('/api/auth/signup', signUp);
app.post('/api/auth/login', logIn);

app.listen(PORT, function () {
  console.log(`Server is running on port: ${PORT}`);
});

async function signUp(req, res) {
  //chercher si un utilisateur avec le même email existe déjà
  const body = req.body;
  const email = body.email;
  const password = body.password;

  const userInDb = await User.findOne({
    email: email,
  });
  console.log('userInDb :', userInDb);
  if (userInDb != null) {
    res.status(400).send('Email already exists');
    return;
  }

  //Si rien de trouvé, alors création d'un user
  const user = {
    email: email,
    password: hashPassword(password),
  };

  try {
    await User.create(user);
    res.send('user créé');
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
}

async function logIn(req, res) {
  const body = req.body;
  const email = body.email;

  const userInDb = await User.findOne({
    email: email,
  });
  console.log('userInDb :', userInDb);

  if (userInDb == null) {
    res.status(401).send('Wrong email');
    return;
  }
  const passwordInDb = userInDb.password;
  if (!isPasswordCorrect(body.password, passwordInDb)) {
    res.status(401).send('Wrong password');
    return;
  }

  res.send({
    userId: userInDb._id,
    token: 'token',
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

module.exports = app;
