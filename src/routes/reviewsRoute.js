const express = require("express");
const { Restaurant, User, Review } = require("../db");

const router = express.Router();

router.post("/", async (req, res) => {
  //email de usuario, rating y description de review, id de restaurant
  const { author, rating, description, id } = req.body;

  try {
    if (author && rating && description && id) {
      if (rating === '1' || rating === '2' || rating === '3' || rating === '4' || rating === '5') {
        const restaurant = await Restaurant.findOne({
          where: {
            id: id,
          },
        });
        //   console.log(restaurant[0].dataValues);
  
        const user = await User.findOne({
          where: {
            email: author,
          },
        });
        //   console.log(user[0].dataValues);
  
        if (restaurant && user) {
          const review = await Review.create({
            rating,
            description,
            user: user.dataValues.username,
            restaurant: restaurant.dataValues.name,
            UserId: user.dataValues.id,
            RestaurantId: restaurant.dataValues.id,
          });
          // console.log(review);
          return res.status(200).send(review);
        } else {
          return res
            .status(400)
            .json({ message: "Usuario/Restaurant no existe" });
        }
      } else {
        return res.status(400).json({ message: "El rating debe ser un número entero entre 1 y 5" });
      }


    } else {
      return res.status(400).json({ message: "Datos incompletos" });
    }
  } catch (e) {
    return res.status(400).json({ message: "Petición inválida" });
  }
});

router.get("/:id", async (req, res) => {
  //id de restaurant
  const { id } = req.params;

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

router.get("/user/:id", async (req, res) => {
  //id de usuario
  const { id } = req.params;

  try {
    if (id) {
      const reviews = await Review.findAll({
        where: {
          UserId: id,
        },
      });
      if (reviews.length) {
        console.log(reviews);
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
    return res.status(400).json({ message: "Petición inválida" })
  }
});


module.exports = router;
