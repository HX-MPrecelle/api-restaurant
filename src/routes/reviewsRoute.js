const express = require("express");
const { Restaurant, User, Review } = require("../db");

const router = express.Router();

router.post("/restaurant", async (req, res) => {
  //id de restaurant
  const { id } = req.body;

  try {
    if (id) {
      const reviews = await Review.findAll({
        where: {
          RestaurantId: id,
        },
      });
      if (reviews.length) {
        // console.log(reviews);
        return res.status(200).send(reviews);
      } else {
        return res
          .status(200)
          .json({ message: "El restaurant no tiene reseñas para mostrar" });
      }
    } else {
      return res.status(400).json({
        message: "Hace falta el ID del restaurant para encontrar sus reseñas",
      });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/user", async (req, res) => {
  //id de usuario
  const { id } = req.body;

  try {
    if (id) {
      const reviews = await Review.findAll({
        where: {
          UserId: id,
        },
      });
      if (reviews.length) {
        // console.log(reviews);
        return res.status(200).send(reviews);
      } else {
        return res
          .status(200)
          .json({ message: "El usuario no ha realizado ninguna reseña" });
      }
    } else {
      return res.status(400).json({
        message: "Hace falta el ID del usuario para encontrar sus reseñas",
      });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/create", async (req, res) => {
  //email de usuario, rating y description de review, id de restaurant
  const { email, rating, description, id } = req.body;

  try {
    if (email && rating && description && id) {
      const restaurant = await Restaurant.findAll({
        where: {
          id: id,
        },
      });
      //   console.log(restaurant[0].dataValues);

      const user = await User.findAll({
        where: {
          email: email,
        },
      });
      //   console.log(user[0].dataValues);

      if (restaurant && user) {
        const review = await Review.create({
          rating,
          description,
          UserId: user[0].dataValues.id,
          RestaurantId: restaurant[0].dataValues.id,
        });
        // console.log(review);
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
