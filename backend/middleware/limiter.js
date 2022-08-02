const rateLimit = require("express-rate-limit");

const max = rateLimit({
  windowMs: 3 * 60 * 1000, // Délai calculé en ms = 3 minutes
  max: 3, // Nombre de tentatives autorisées
});

module.exports = { max };