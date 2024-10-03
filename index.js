require('dotenv').config();

const { app } = require('./config/app.js');
const { usersRouter } = require('./routes/users.routes');
const { booksRouter } = require('./routes/books.routes');

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => res.send('Hello World, Server running!'));

app.use('/api/auth', usersRouter);
app.use('/api/books', booksRouter);

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));
