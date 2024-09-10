const { Book } = require('../models/Book.js');
const { books } = require('../db/books');
const { upload } = require('../middlewares/multer.js');

const express = require('express');

async function postBook(req, res) {
  const file = req.file;
  const stringifiedBook = req.body.book;
  const book = JSON.parse(stringifiedBook);
  book.imageUrl = file.filename;
  try {
    const result = await Book.create(book);
    res.send({ message: 'Book posted', book: result });
  } catch (e) {
    console.error(e);
    res.status(500).send('something went wrong: ' + e.message);
  }
}

function getBooks(req, res) {
  res.send(books);
}

const booksRouter = express.Router();
booksRouter.get('/', getBooks);
booksRouter.post('/', upload.single('image'), postBook);

module.exports = { booksRouter };
