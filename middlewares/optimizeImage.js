const sharp = require('sharp');
const path = require('path');

const optimizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const file = req.file;
  const outputFileName = `${Date.now()}_${file.originalname.toLowerCase()}.webp`;
  const outputFilePath = path.join(
    `./${String(process.env.IMAGES_FOLDER)}`,
    outputFileName
  );

  try {
    await sharp(file.buffer)
      .resize(800)
      .toFormat('webp')
      .webp({ quality: 80 })
      .toFile(outputFilePath);

    file.optimizedFileName = outputFileName;
    file.optimizedFilePath = outputFilePath;
    next();
  } catch (e) {
    console.error("erreur lors de l'optimisation de l'image", e);
    res.status(500).send("erreur lors de l'optimisation de l'image");
  }
};

module.exports = { optimizeImage };
