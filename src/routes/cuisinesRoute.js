const express = require("express");
const { getCuisines } = require("../controller/controller");
const { Type } = require("../db");

const router = express.Router();

//Obtengo todos los tipos de cocina
router.get("/", async (req, res) => {
  try {
    const types = await getCuisines();
    types?.forEach((t) => {
      Type.findOrCreate({
        where: {
          name: t,
        },
      });
    });
    const allTypes = await Type.findAll();
    return res.status(200).send(allTypes);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Ocurrió algo inesperado" });
  }
});

module.exports = router;
