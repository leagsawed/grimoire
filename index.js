require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const { usersRouter } = require('./routes/users.routes');
const { booksRouter } = require('./routes/books.routes');
const mongoose = require('mongoose');
const DB_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_DOMAIN}`;
const IMAGES_FOLDER = String(process.env.IMAGES_FOLDER);
const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => res.send('Hello World, Server running!'));
app.use(cors());
app.use(express.json());
app.use('/' + process.env.URL_PATH, express.static(IMAGES_FOLDER));
app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
app.use('/api/auth', usersRouter);
app.use('/api/books', booksRouter);
connect();

async function connect() {
  try {
    await mongoose.connect(DB_URL);
    console.log('Connected to DB');
  } catch (error) {
    console.error(error);
  }
}
