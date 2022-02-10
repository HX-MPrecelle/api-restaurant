const express = require("express");
const { Restaurant, User, Reserve } = require("../db");

const router = express.Router();

router.post("/", async (req, res) => {
  //email de usuario, date, time y pax de reserve, id de restaurant
  const { email, date, time, pax, id } = req.body;

  try {
    if (email && date && time && pax && id) {
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
        // console.log(restaurant[0].dataValues.personas_max);
        if (restaurant[0].dataValues.personas_max >= pax) {
          const reserve = await Reserve.create({
            date,
            time,
            pax,
            UserId: user[0].dataValues.id,
            RestaurantId: restaurant[0].dataValues.id,
          });
          await Restaurant.update(
            {
              personas_max: restaurant[0].dataValues.personas_max - pax,
            },
            {
              where: {
                id: restaurant[0].dataValues.id,
              },
            }
          );
          // console.log(restaurant[0].dataValues);
          return res.status(200).send(reserve);
        } else {
          return res.status(400).json({
            message: `Solo nos quedan ${restaurant[0].dataValues.personas_max} lugares disponibles`,
          });
        }
      } else {
        return res
          .status(400)
          .json({ message: "Usuario/Restaurant no existe" });
      }
    } else {
      return res.status(400).json({ message: "Faltan rellenar campos" });
    }
  } catch (e) {
    return res.status(404).send({ message: "Petición inválida" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const reserve = await Reserve.findOne({
      where: {
        id,
      },
    });

    // console.log('Soy restaurant', restaurant);
    if (reserve) {
      const restaurant = await Restaurant.findOne({
        where: {
          id: reserve.RestaurantId,
        },
      });
      // console.log(reserve);
      // console.log(restaurant);
      const updatedRestaurant = await restaurant.update(
        {
          personas_max:
            restaurant.dataValues.personas_max + reserve.dataValues.pax,
        },
        {
          where: {
            id: restaurant.dataValues.id,
          },
        }
      );
      // console.log(updatedRestaurant);
      await reserve.destroy();

      return res.status(200).send(updatedRestaurant);
    }
    return res
      .status(400)
      .json({ message: "No se ha podido encontrar la reserva a eliminar" });
  } catch (e) {
    return res.status(404).json({ message: "Petición inválida" });
  }
});

router.get("/restaurant/:id", async (req, res) => {
  //id de restaurant
  const { id } = req.params;

  try {
    if (id) {
      const reserves = await Reserve.findAll({
        where: {
          RestaurantId: id,
        },
      });
      if (reserves.length) {
        // console.log(reserves);
        return res.status(200).send(reserves);
      } else {
        return res.status(200).json({
          message: "El restaurant no tiene reservas para los próximos días",
        });
      }
    } else {
      return res.status(400).json({
        message: "Hace falta el ID del restaurant para encontrar sus reservas",
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
  }
});

module.exports = router;
