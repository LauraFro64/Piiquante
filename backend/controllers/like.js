const Sauce = require("../models/Sauce");

exports.likeSauce = (req, res, next) => {


// LIKE 
  if (req.body.like === 1) { // dans le req.body on retrouve le user id et le like

    // updateOne(): Mise à jour du modèle avec les nouvelles valeurs des champs spécifiées 
    Sauce.updateOne(

      // req.params: Récupère l'id dans l'url de la requête
      // (id -> _id): Mise au format de l'id récupéré
      { _id: req.params.id },

      {
        // $push: Incrémente le array userLiked avec la valeur de l'élément désigné
        $push: { usersLiked: req.body.userId },

        // $inc: Créer le champ et défini le champ sur la valeur spécifiée
        $inc: { likes: +1 }
      }
    )
      // Affichage d'une alerte confirmant l'ajout du like
      // Statut 200 - OK: indique la réussite de la requête
      .then(() => res.status(200).json({ message: "Like ajouté !" }))

      // Statut 400 - Bad Request: indique que la syntaxe de la requête est invalide
      .catch((error) => res.status(400).json({ error }));


// DISLIKE
  } else if (req.body.like === -1) {

    Sauce.updateOne(
      { _id: req.params.id },
      { $push: { usersDisliked: req.body.userId }, $inc: { dislikes: +1 } }
    )
      .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
      .catch((error) => res.status(400).json({ error }));


// SANS AVIS
  } else {

    // findOne(): recherche et renvoie l'élément qui correspond aux critères de sélections donnés 
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {

        // includes(): Détermine si le tableau usersLiked contient une valeur et renvoi un booléen
        if (sauce.usersLiked.includes(req.body.userId)) {

          // updateOne(): Mise à jour du modèle avec les nouvelles valeurs des champs spécifiées 
          Sauce.updateOne(
            { _id: req.params.id },

            {
              // $pull: Supprime du tableau usersLiked l'id de l'utilisateur contenu
              $pull: { usersLiked: req.body.userId }, //opérateur MongoDB

              // $inc: Incrémente la valeur -1 à celle existante (+1), ce qui ré-initialise la valeur définie par défaut (0).
              $inc: { likes: -1 } //opérateur MongoDB
            }
          )
            .then(() => res.status(200).json({ message: "Like retiré !" }))
            .catch((error) => res.status(400).json({ error }));

        } else if (sauce.usersDisliked.includes(req.body.userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              { $pull: { usersDisliked: req.body.userId },
                $inc: { dislikes: -1 }}
            )
              .then(() => res.status(200).json({ message: "Dislike retiré !" }))
              .catch((error) => res.status(400).json({ error }));
          }
        })

      .catch((error) => res.status(400).json({ error }));

  }
};
