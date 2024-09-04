const express = require('express');
const app = express();
const { User } = require('./db/mongo');

const cors = require('cors'); //CORS = Cross Origin Ressource Sharing, permet aux serveurs de spécifier quelles origines (domaines) sont autorisées à accéder à leurs ressources

const PORT = 4000;

app.use(cors());
app.use(express.json());

function sayHello(req, res) {
  res.send('Hello World');
}

app.get('/', sayHello);
app.post('/api/auth/signup', signUp);
app.post('/api/auth/login', logIn);

app.use((req, res, next) => {
  console.log('requete reçue');
  next();
});

app.use((req, res, next) => {
  res.json({ message: 'votre requete a bien été reçue' });
});

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
    password: password,
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
  if (passwordInDb != body.password) {
    res.status(401).send('Wrong password');
    return;
  }

  res.send({
    userId: userInDb._id,
    token: 'token',
  });
}

module.exports = app;
