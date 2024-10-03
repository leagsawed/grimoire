const { Book } = require('../models/Book.js');
const { upload } = require('../middlewares/multer.js');
const { optimizeImage } = require('../middlewares/optimizeImage.js');
const { deleteImage } = require('../middlewares/deleteImage.js');
const { checkToken } = require('../middlewares/checkToken.js');
const express = require('express');

const booksRouter = express.Router();
booksRouter.get('/bestrating', getBestRating);
booksRouter.get('/:id', getBookById);
booksRouter.get('/', getBooks);
booksRouter.post(
  '/',
  checkToken,
  upload.single('image'),
  optimizeImage,
  postBook
);
booksRouter.delete('/:id', checkToken, deleteBook);
booksRouter.put(
  '/:id',
  checkToken,
  upload.single('image'),
  optimizeImage,
  putBook
);
booksRouter.post('/:id/rating', checkToken, rateBook);

async function rateBook(req, res) {
  const bookId = req.params.id;
  if (bookId == null || bookId == 'undefined') {
    res.status(400).send('Book id is missing');
    return;
  }
  const body = req.body;
  const rating = body.rating;
  const userIdInToken = req.userToken;
  try {
    const bookInDb = await Book.findById(bookId);
    if (!bookInDb) {
      return res.status(404).send('Livre inexistant');
    }
    const previousRatingFromCurrentUser = bookInDb.ratings.find(
      (rating) => rating.userId == userIdInToken
    );
    if (previousRatingFromCurrentUser != null) {
      res.status(400).send('Vous avez déjà noté ce livre');
      return;
    }

    const newRating = { userId: userIdInToken, grade: rating };
    bookInDb.ratings.push(newRating);

    bookInDb.averageRating = calculateAverageRatings(bookInDb);
    bookInDb.imageUrl = getAbsoluteImagePath(bookInDb.imageUrl);

    await bookInDb.save();
    res.send(bookInDb);
  } catch (e) {
    res.status(500).send('Il y a eu un problème: ' + e.message);
  }
}

function calculateAverageRatings(bookInDb) {
  const totalRatings = bookInDb.ratings.reduce(
    (sum, rating) => sum + rating.grade,
    0
  );
  return totalRatings / bookInDb.ratings.length;
}

async function getBestRating(req, res) {
  try {
    const booksWithBestRatings = await Book.find()
      .sort({ ratings: -1 })
      .limit(3);
    booksWithBestRatings.forEach((book) => {
      book.imageUrl = getAbsoluteImagePath(book.imageUrl);
    });
    res.send(booksWithBestRatings);
  } catch (e) {
    console.error(e);
    res.status(500).send('Il y a eu un problème: ' + e.message);
  }
}

async function putBook(req, res) {
  const bookId = req.params.id;
  const file = req.file;
  const book = req.body;

  try {
    const bookInDb = await Book.findById(bookId);
    if (bookInDb == null) {
      res.status(404).send('Livre inexistant');
      return;
    }

    const userIdInDb = bookInDb.userId;
    const userIdInToken = req.userToken;
    if (userIdInDb != userIdInToken) {
      res.status(403).send('Non-autorisé');
      return;
    }

    const newBook = {};
    if (book.title) newBook.title = book.title;
    if (book.author) newBook.author = book.author;
    if (book.year) newBook.year = book.year;
    if (book.genre) newBook.genre = book.genre;
    if (file != null) {
      await deleteImage(bookInDb.imageUrl);

      newBook.imageUrl = file.optimizedFileName;
    }

    await Book.findByIdAndUpdate(bookId, newBook);
    res.send('Livre mis à jour');
  } catch (e) {
    console.error(e);
    res.status(500).send('Il y a eu un problème: ' + e.message);
  }
}

async function deleteBook(req, res) {
  const bookId = req.params.id;
  try {
    const bookInDb = await Book.findById(bookId);
    if (bookInDb == null) {
      res.status(404).send('Book not found');
      return;
    }
    const userIdInDb = bookInDb.userId;
    const userIdInToken = req.userToken;
    if (userIdInDb != userIdInToken) {
      res
        .status(403)
        .send(
          'Vous ne pouvez pas supprimer les livres des autres utilisateurs'
        );
      return;
    }

    await deleteImage(bookInDb.imageUrl);

    await Book.findByIdAndDelete(bookId);
    res.send('Book deleted');
  } catch (e) {
    console.error(e);
    res.status(500).send('Il y a eu un problème: ' + e.message);
  }
}

async function getBookById(req, res) {
  try {
    const id = req.params.id;
    const book = await Book.findById(id);
    if (book == null) {
      res.status(404).send('Livre inexistant');
      return;
    }
    book.imageUrl = getAbsoluteImagePath(book.imageUrl);
    res.send(book);
  } catch (e) {
    console.error(e);
    res.status(500).send('Il y a eu un problème: ' + e.message);
  }
}

async function postBook(req, res) {
  const stringifiedBook = req.body.book;
  const book = JSON.parse(stringifiedBook);

  if (!book.title || !book.year || !book.genre) {
    return res.status(400).send('Tous les champs sont requis');
  }

  if (!book.ratings[0].grade) {
    return res.status(400).send('Veuillez attribuer une note');
  }
  try {
    if (!req.file || !req.file.optimizedFileName) {
      return res.status(400).send('Image is required');
    }

    book.imageUrl = req.file.optimizedFileName;
    const result = await Book.create(book);
    res.send({ message: 'Livre publié', book: result });
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
}

async function getBooks(req, res) {
  try {
    const booksInDb = await Book.find();
    booksInDb.forEach((book) => {
      book.imageUrl = getAbsoluteImagePath(book.imageUrl);
    });
    res.send(booksInDb);
  } catch (e) {
    console.error(e);
    res.status(500).send(e.message);
  }
}

function getAbsoluteImagePath(fileName) {
  if (!fileName.startsWith('http')) {
    return process.env.PUBLIC_URL + '/' + process.env.URL_PATH + '/' + fileName;
  }
  return fileName;
}

module.exports = { booksRouter };
