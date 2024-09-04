const express = require('express');
const app = express();
const cors = require('cors');

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

const users = [];

function signUp(req, res) {
  const body = req.body;
  const email = body.email;
  const password = body.password;

  const userInDb = users.find((user) => user.email === email);
  if (userInDb != null) {
    res.status(400).send('Email already exists');
    return;
  }

  const user = {
    email: email,
    password: password,
  };

  users.push(user);
  res.send('Sign up');
  console.log('users in db :', users);
}

function logIn(req, res) {
  const body = req.body;
  const email = body.email;
  console.log('body :', body);
  console.log('users in db :', users);

  const userInDb = users.find((user) => user.email === email);
  if (userInDb == null) {
    res.status(401).send('Wrong IDs');
    return;
  }
  const passwordInDb = userInDb.password;
  if (passwordInDb != body.password) {
    res.status(401).send('Wrong IDs');
    return;
  }

  if (body.email != 'gael.dewas@gmail.com') {
    res.status(401).send('wrong IDs');
    return;
  }
  if (body.password != '1234') {
    res.status(401).send('wrong IDs');
    return;
  }
  res.send({
    userId: '123',
    token: 'token',
  });
}

module.exports = app;
