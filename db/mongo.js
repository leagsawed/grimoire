const mongoose = require('mongoose');

const PASSWORD = 'js9Bhqw5hndaOZxC';
const USER = 'sawedleag';
const DB_URL = `mongodb+srv://${USER}:${PASSWORD}@cluster0.ddrrd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

async function connect() {
  try {
    await mongoose.connect(DB_URL);
    console.log('Connected to DB');
  } catch (error) {
    console.error(error);
  }
}
connect();

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model('User', UserSchema);
const gael = new User({
  email: 'gael.dewas@gmail.com',
  password: 'mongoDB',
});

// gael.save().then(() => console.log('gael saved'));

module.exports = { User };
