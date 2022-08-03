// Utilisation du modèle de mongoose
const User = require('../models/User')

// Permet le chiffrage du mot passe avec la méthode .hash() // npm install bcrypt
const bcrypt = require('bcrypt'); 

// Permet de créer et vérifier un token d'authentificaton // npm install jsonwebtoken
const jwt = require('jsonwebtoken'); 

// SIGN UP
exports.signup = (req, res, next) => {

    // .hach(): Hachage, cryptage du mot de passe 
    // "Salage = 10 tours de l'algorythme" + valeur élevée, + l'exécution de la fonction sera longuecmais + le hachage sera sécurisé
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()

          // Statut 201 - Created: indique que la requête a réussie et que la ressource a été créée.
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))

          // Statut 400 - Bad Request: indique que la syntaxe de la requête est invalide
          .catch(error => res.status(400).json({ error }));
      })

      // Statut 500 - Internal Server Error: indique une erreur interne du serveur non identifiée
      .catch(error => res.status(500).json({ error }));
};

// Login
exports.login = (req, res, next) => {

    // findOne(): recherche et renvoie le document qui correspond aux critères de sélections donnés 
    User.findOne({ email: req.body.email })
      .then(user => {
        if (user === null) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }

        // Compare le mot de passe entré par l'utilisateur avec le hash enregistré dans la base de donnée
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              
              //.sign(): Encodage du nouveau token qui contient l'id de l'utilisateur en tant que payload (données encodées)
              token: jwt.sign(
                { userId: user._id },
                
                // Chaîne secrète d'encodage du token (normalement bcp plus complexe)
                process.env.RANDOM_TOKEN_SECRET,
                
                // Durée de validité du token: l'utilisateur devra se reconnecter au bout de 24h
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };