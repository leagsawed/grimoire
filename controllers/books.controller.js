const { Book } = require('../models/Book.js');
const { upload } = require('../middlewares/multer.js');
const express = require('express');
const jwt = require('jsonwebtoken');

const booksRouter = express.Router();
booksRouter.get('/:id', getBookById);
booksRouter.get('/', getBooks);
booksRouter.post('/', checkToken, upload.single('image'), postBook);
// booksRouter.put

function checkToken(req, res, next) {
  const headers = req.headers;
  const authorization = headers.authorization;
  if (authorization == null) {
    res.status(401).send('Unauthorized');
    return;
  }
  const token = authorization.split(' ')[1];
  try {
    const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    console.error(e);
    res.status(401).send('Unauthorized');
  }
}

async function getBookById(req, res) {
  try {
    const id = req.params.id;
    const book = await Book.findById(id);
    if (book == null) {
      res.status(404).send('Book not found');
      return;
    }
    book.imageUrl = getAbsoluteImagePath(book.imageUrl);
    res.send(book);
  } catch (e) {
    console.error(e);
    res.status(500).send('something went wrong: ' + e.message);
  }
}

async function postBook(req, res) {
  const filename = req.file.filename;
  const stringifiedBook = req.body.book;
  const book = JSON.parse(stringifiedBook);
  book.imageUrl = filename;
  try {
    const result = await Book.create(book);
    res.send({ message: 'Book posted', book: result });
  } catch (e) {
    console.error(e);
    res.status(500).send('something went wrong: ' + e.message);
  }
}

async function getBooks(req, res) {
  const booksInDb = await Book.find();
  booksInDb.forEach((book) => {
    book.imageUrl = getAbsoluteImagePath(book.imageUrl);
  });
  res.send(booksInDb);
}

function getAbsoluteImagePath(fileName) {
  return (
    process.env.PUBLIC_URL +
    '/' +
    process.env.IMAGES_FOLDER_PATH +
    '/' +
    fileName
  );
}

// Book.deleteMany({}).then(() => {
//   console.log('books deleted');
// });

module.exports = { booksRouter };
