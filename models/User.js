const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.plugin(uniqueValidator);

const User = mongoose.model('User', UserSchema);

module.exports = { User };
