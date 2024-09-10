const { app } = require('./config/app.js');
const { usersRouter } = require('./controllers/users.controller.js');
const { booksRouter } = require('./controllers/books.controller.js');

app.get('/', (req, res) => res.send('Hello World, Server running!'));

app.use('/api/auth', usersRouter);
app.use('/api/books', booksRouter);
