// Utlisation du modèle de mongoose
const Sauce = require("../models/Sauce");

// File System: Permet de créer et gérer les fichiers pour y stocker ou lire des informations 
const fs = require("fs");


// Création d'une sauce
exports.createSauce = (req, res, next) => {
  // Analyse et converti la chaine JSON sauce en objet Javascript utilisable
  const sauceObject = JSON.parse(req.body.sauce);
  // Suppression de _id car l'utilisation du mot-clé new avec un modèle Mongoose crée par défaut un champ _id
  delete sauceObject._id;
  delete sauceObject._userId; // éviter qu'une personne mal intentionnée de faire une requête avec son token mais en nous envoyant le userID de qqun d'autre 

  const sauce = new Sauce({
    // Opération spread permettant de faire une copie du req.body
    ...sauceObject,
    _userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
    // Méthode permettant l'enregistrement de la Sauce dans la base de données
    sauce.save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};


// Récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
  // find(): Renvoie un tableau contenant toutes les sauces présentes dans la base de données
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

// Récupérer une seule sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// Modifier une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((Sauce) => {
          if (Sauce.userId != req.auth.userId) { // toujours s'assurer que c'est le bon utilisateur derrière la manip
              res.status(401).json({ message : 'Non autorisé!'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Sauce modifiée!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

// Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(Sauce => {
          if (Sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Non autorisé!'});
          } else {
              const filename = Sauce.imageUrl.split('/images/')[1];

              // lui passer la sauce à supprimer et le callback à exécuter une fois la sauce supprimée
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Sauce supprimée!'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};