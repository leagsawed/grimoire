const { upload } = require('../middlewares/multer.js');
const { optimizeImage } = require('../middlewares/optimizeImage.js');
const {
  postBook,
  putBook,
  deleteBook,
  rateBook,
  getBookById,
  getBooks,
  getBestRating,
} = require('../controllers/books.controller');
const { checkToken } = require('../middlewares/checkToken');
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

module.exports = { booksRouter };
