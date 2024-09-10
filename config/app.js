const express = require('express');
const app = express();
const cors = require('cors'); //Cross Origin Ressource Sharing,  permet de définir quelles origines peuvent accéder aux ressources du serveur

const PORT = process.env.PORT || 4000;

app.listen(PORT, function () {
  console.log(`Server is running on port: ${PORT}`);
});

app.use(cors());
app.use(express.json());
app.use('/images', express.static('uploads'));

module.exports = { app };
