const path = require('path');
const fs = require('fs');

async function deleteImage(imageUrl) {
  if (!imageUrl) return;

  const imagePath = path.join(
    __dirname,
    `../${process.env.IMAGES_FOLDER}`,
    imageUrl
  );

  try {
    await fs.promises.unlink(imagePath);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(`Erreur lors de la suppression de l'image: ${err.message}`);
    }
  }
}

module.exports = { deleteImage };
