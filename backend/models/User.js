// npm install mongoose-unique-validator
// améliore les messages d'erreur lors de l'enregistrement de données uniques

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Vérification de l'unicité de l'adresse e-mail
userSchema.plugin(uniqueValidator);

// model(): Transforme le modèle en modèle ré-utilisable
module.exports = mongoose.model('User', userSchema);