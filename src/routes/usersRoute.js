const express = require("express");
const { User, Restaurant, Review, Reserve } = require("../db");
const bcrypt = require("bcryptjs");

const router = express.Router();

//Creo un usuario
router.post("/", async (req, res) => {
  const { username, email, password, password2 } = req.body;

  let errors = [];

  if (!username || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password should be at least 6 characters" });
  }

  if (password != password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length) {
    return res.status(400).send(errors);
  }

  try {
    const allUser = await User.findAll();
    const userEmail = allUser.find(
      (e) => e.email.toLowerCase() === email.toLowerCase()
    );
    if (userEmail) return res.status(400).send("Email already exist");
    //Hasheo la password para enviarla de forma segura a la DB, el segundo parametro son las vueltas de encriptación que queremos darle.
    let hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(200).send(newUser);
  } catch (e) {
    return res.status(404).json({ message: "Petición inválida" });
  }
});

//Obtengo los restaurants creados por un usuario en particular
router.get("/:id/restaurants", async (req, res) => {
  const { id } = req.params;

  try {
    if (id) {
      const user = await User.findOne({
        where: {
          id: id,
        },
      });
      if (user) {
        const restaurants = await Restaurant.findAll({
          where: {
            owner: user.email,
          },
        });
        return res.status(200).send(restaurants);
      } else {
        return res.status(400).json({ message: "El usuario no existe" });
      }
    } else {
      return res.status(400).json({
        message:
          "Se necesita un ID de usuario para poder encontrar sus restaurants",
      });
    }
  } catch (e) {
    return res.status(404).json({ message: "Petición inválida" });
  }
});

//Obtengo las reviews creadas por un usuario en particular
router.get("/:id/reviews", async (req, res) => {
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
    return res.status(400).json({ message: "Petición inválida" });
  }
});

//Elimino la reseña por su id
router.delete("/:id/reviews/:idReview", async (req, res) => {
  const { id, idReview } = req.params;

  try {
    const user = await User.findOne({
      where: {
        id,
      },
    });

    const review = await Review.findOne({
      where: {
        id: idReview,
        UserId: user.dataValues.id,
      },
    });

    if (review) {
      await review.destroy();
      return res.status(200).json({ message: "Reseña eliminada con éxito" });
    }
    return res
      .status(400)
      .json({ message: "Sólo el autor de la reseña puede eliminarla" });
  } catch (e) {
    return res.status(404).json({ message: "Petición inválida" });
  }
});

//Obtengo todas las reservas realizadas por un usuario en particular
router.get("/:id/reserves", async (req, res) => {
  //id de usuario
  const { id } = req.params;

  try {
    if (id) {
      const reserves = await Reserve.findAll({
        where: {
          UserId: id,
        },
      });
      if (reserves.length) {
        // console.log(reserves);
        return res.status(200).send(reserves);
      } else {
        return res.status(200).json({
          message: "El usuario no tiene reservas para los próximos días",
        });
      }
    } else {
      return res.status(400).json({
        message: "Hace falta el ID del usuario para encontrar sus reservas",
      });
    }
  } catch (e) {
    return res.status(404).json({ message: "Petición inválida" });
  }
});

module.exports = router;
