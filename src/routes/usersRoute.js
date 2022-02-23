const express = require("express");
const { User, Restaurant, Review, Reserve } = require("../db");
const bcrypt = require("bcryptjs");

const router = express.Router();

//Creo un usuario
router.post("/", async (req, res) => {
  const { username, email, password, password2, secretword } = req.body;

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
    let hashedSecretWord = await bcrypt.hash(secretword, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      secretword: hashedSecretWord
    });
    return res.status(200).send(newUser);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Ocurrió algo inesperado" })  }
});

//Restablezco contraseña
router.put("/resetPassword", async (req, res) => {
  try {
  const { email, password, password2, secretword } = req.body;

  if (!email || !password || !password2 || secretword == undefined ) {
    return res.status(400).json({ message: "Por favor, complete todos los campos" })
  }


    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (user) {
      let sameWord = bcrypt.compareSync(secretword, user.secretword);
      if (!sameWord) {
        return res.status(400).json({
          message: `La palabra secreta no es valida`,
        });
      }
      
      if (password === password2) {
        let hashedPassword = await bcrypt.hash(password, 10)
        await user.update(
          {
            password: hashedPassword,
          },
          {
            where: {
              email,
            },
          }
        );
        return res.status(200).json({
          message: `Su contraseña ha sido restablecida correctamente`,
        });
      } else {
        return res.status(400).json({ message: "Las constraseñas no coinciden" })
      }
    } else {
      return res.status(400).json({
        message: "Usuario inválido",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Ocurrió algo inesperado" })  }
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
    console.log(e);
    return res.status(500).json({ message: "Ocurrió algo inesperado" })  }
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
    console.log(e);
    return res.status(500).json({ message: "Ocurrió algo inesperado" })  }
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
    console.log(e);
    return res.status(500).json({ message: "Ocurrió algo inesperado" })  }
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
    console.log(e);
    return res.status(500).json({ message: "Ocurrió algo inesperado" })  }
});

//Agrego favorito a un usuario especifico
router.put("/:id/favorites", async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;

  try {
    const user = await User.findOne({
      where: {
        id,
      },
    });
    if (user) {
      const findFav = user.dataValues.favorite?.find((e) => e == favorite);
      if (!findFav) {
        await user.update(
          {
            favorite:
              user.dataValues.favorite === null
                ? [favorite]
                : [...user.dataValues.favorite, favorite],
          },
          {
            where: {
              id,
            },
          }
        );

        const favName = await Restaurant.findOne({
          where: {
            id: favorite,
          },
        });

        return res.status(200).json({
          message: `${favName.dataValues.name} ha sido añadido a su lista de favoritos`,
        });
      } else {
        return res.status(400).json({
          message: `${favName.dataValues.name} ya existe en su lista de favoritos`,
        });
      }
    } else {
      return res
        .status(400)
        .json({ message: "El usuario no existe o no está loggeado" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Ocurrió algo inesperado" })  }
});

//Traigo los favoritos de un usuario específico
router.get("/:id/favorites", async (req, res) => {
  const { id } = req.params;

  try {
    if (id) {
      const user = await User.findOne({
        where: {
          id,
        },
      });
      console.log(user.dataValues);
      if (user.dataValues.favorite) {
        const favs = [];
        for (const fav of user.dataValues.favorite) {
          let restaurant = await Restaurant.findOne({
            where: {
              id: fav,
            },
          });
          favs.push(restaurant.dataValues);
        }

        const response = [];
        for (const fav of favs) {
          // console.log(fav);
          let obj = {
            id: fav.id,
            name: fav.name,
            rating: fav.rating,
            cuisine: fav.cuisine
          }
          response.push(obj)
        }

        console.log(response);
        return res.status(200).send(response);
      } else {
        res
          .status(400)
          .json({ message: "Aún no has agregado ningún favorito a tu lista" });
      }
    } else {
      return res.status(400).json({ message: "No se encontró el usuario por su ID" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Ocurrió algo inesperado" })  }
});

//Elimino favorito de la lista de un usuario específico
router.delete("/:id/favorites", async (req, res) => {
  const { id } = req.params;
  const { favId } = req.query;

  try {
    if (id && favId) {
      const user = await User.findOne({
        where: {
          id,
        },
      });

      if (user.dataValues.favorite.length > 0) {
        const favorite = user.dataValues.favorite?.filter((e) => e !== favId);

        await user.update(
          {
            favorite: favorite,
          },
          {
            where: {
              id,
            },
          }
        );

        const favName = await Restaurant.findOne({
          where: {
            id: favId,
          },
        });

        return res.status(200).json({
          message: `Has eliminado a ${favName.dataValues.name} de tu lista de favoritos`,
        });
      } else {
        return res.status(400).json({
          message:
            "No tienes ningún favorito agregado en tu lista para poder eliminar",
        });
      }
    } else {
      res
        .status(400)
        .json({ message: "Faltan datos para poder eliminar el favorito" });
      return
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Ocurrió algo inesperado" })  }
    return
});

module.exports = router;
