const express = require('express');
const { signUp, logIn } = require('../controllers/users.controller.js');

const usersRouter = express.Router();
usersRouter.post('/signup', signUp);
usersRouter.post('/login', logIn);

module.exports = { usersRouter };
