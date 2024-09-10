require('dotenv').config();

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const DB_URL = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@${process.env.DB_DOMAIN}`;

async function connect() {
  try {
    await mongoose.connect(DB_URL);
    console.log('Connected to DB');
  } catch (error) {
    console.error(error);
  }
}
connect();

UserSchema.plugin(uniqueValidator);

module.exports = { mongoose };
