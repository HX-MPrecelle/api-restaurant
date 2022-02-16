const express = require("express");
const { Neighborhood } = require("../db");

const router = express.Router();

const neighborhood_data = [
  "Chacarita",
  "Paternal",
  "Villa Crespo",
  "Villa del Parque",
  "Almagro",
  "Caballito",
  "Villa Santa Rita",
  "Monte Castro",
  "Villa Real",
  "Flores",
  "Floresta",
  "Constitucion",
  "San Cristobal",
  "Boedo",
  "Velez Sarsfield",
  "Villa Luro",
  "Parque Patricios",
  "Mataderos",
  "Villa Lugano",
  "San Telmo",
  "Saavedra",
  "Coghlan",
  "Villa Urquiza",
  "Colegiales",
  "Balvanera",
  "Villa Gral. Mitre",
  "Parque Chas",
  "Agronomia",
  "Villa Ortuzar",
  "Barracas",
  "Parque Avellaneda",
  "Parque Chacabuco",
  "Nueva Pompeya",
  "Palermo",
  "Villa Riachuelo",
  "Villa Soldati",
  "Villa Pueyrredon",
  "Villa Devoto",
  "Liniers",
  "Versalles",
  "Puerto Madero",
  "Monserrat",
  "San Nicolas",
  "Belgrano",
  "Recoleta",
  "Retiro",
  "Nuñez",
  "La Boca",
];

//Obtengo todos los barrios
router.get("/", async (req, res) => {
  var neighborhoods = neighborhood_data;
  try {
    neighborhoods?.forEach((n) => {
      Neighborhood.findOrCreate({
        where: {
          name: n,
        },
      });
    });
    const allNeighborhoods = await Neighborhood.findAll();
    return res.status(200).send(allNeighborhoods);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
