const express = require("express");
const { getCuisines } = require("../controller/controller");
const { Type } = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  const types = await getCuisines();

  try {
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
  }
});

module.exports = router;
