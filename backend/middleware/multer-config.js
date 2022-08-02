// Gestionnaire de fichiers entrant dans les requêtes HTTP // npm install multer
const multer = require('multer');

// Extensions autorisées de fichier
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// Configuration de multer: contient la logique indiquant où enregistrer le fichier entrant
const storage = multer.diskStorage({

  // destination: indique à multer où l'image doit être stockée
  destination: (req, file, callback) => {
    callback(null, 'images');
  },

  // filename: nommage du fichier
  filename: (req, file, callback) => {

    // Garde le nom d'origine du fichier en remplaçant les espaces par des underscores
    const name = file.originalname.split(' ').join('_');

    // Résoud l'extension de fichier approprié
    const extension = MIME_TYPES[file.mimetype];

    // Ajout d'un timestamp (horodatage) au nom du fichier avec Date.now()
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Export de l'élément multer configuré / .single() indique la gestion uniquement des images téléchargées
module.exports = multer({storage: storage}).single('image');