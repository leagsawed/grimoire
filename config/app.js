const express = require('express');
const app = express();
const cors = require('cors'); //Cross Origin Ressource Sharing,  permet de définir quelles origines peuvent accéder aux ressources du serveur
require('./../db/mongo');

const IMAGES_FOLDER = String(process.env.IMAGES_FOLDER);

app.use(cors());
app.use(express.json());
app.use('/' + process.env.URL_PATH, express.static(IMAGES_FOLDER));

module.exports = { app };
