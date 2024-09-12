const express = require('express');
const app = express();
const cors = require('cors'); //Cross Origin Ressource Sharing,  permet de définir quelles origines peuvent accéder aux ressources du serveur
require('./../db/mongo');

app.use(cors());
app.use(express.json());
app.use('/' + process.env.IMAGES_FOLDER_PATH, express.static('uploads'));

module.exports = { app };
