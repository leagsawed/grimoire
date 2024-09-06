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

// const UserSchema = new mongoose.Schema({
//   email: String,
//   password: String,
// });

const UserSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', UserSchema);
const gael = new User({
  email: 'gael.dewas@gmail.com',
  password: 'mongoDB',
});

UserSchema.plugin(uniqueValidator);

module.exports = { User, UserSchema };
