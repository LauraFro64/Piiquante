const express = require("express");

// Permet de créer des routeurs séparés pour chaque route principale de l'application
const router = express.Router();

const sauceCtrl = require("../controllers/sauce");
const likeCtrl = require("../controllers/like");

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config.js");

// Enregistrement des routes individuelles CRUD

// CREATE
router.post("/", auth, multer, sauceCtrl.createSauce); // toujours placer multer après auth !


// READ
router.get("/", auth, sauceCtrl.getAllSauces);
router.get("/:id", auth, sauceCtrl.getOneSauce);

// UPDATE
router.put("/:id", auth, multer, sauceCtrl.modifySauce);

// DELETE
router.delete("/:id", auth, sauceCtrl.deleteSauce);

// LIKE
router.post("/:id/like", auth, likeCtrl.likeSauce);

// Exportation des méthodes attribuées aux routes
module.exports = router;
