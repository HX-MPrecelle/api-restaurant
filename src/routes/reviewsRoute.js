const express = require("express");
const { Restaurant, User, Review } = require("../db");

const router = express.Router();

router.post("/", async (req, res) => {
  //email de usuario, rating y description de review, id de restaurant
  const { email, rating, description, id } = req.body;

  try {
    if (email && rating && description && id) {
      const restaurant = await Restaurant.findAll({
        where: {
          id: id,
        },
      });
      console.log(restaurant[0].dataValues);

      const user = await User.findAll({
        where: {
          email: email,
        },
      });
      console.log(user[0].dataValues);

      if (restaurant && user) {
        const review = await Review.create({
          rating,
          description,
          UserId: user[0].dataValues.id,
          RestaurantId: restaurant[0].dataValues.id
        });
        console.log(review);
        return res.status(200).send(review);
      } else {
        return res
          .status(400)
          .send({ message: "Usuario/Restaurant no existe" });
      }
    } else {
      return res.status(400).send({ message: "Petición inválida" });
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
