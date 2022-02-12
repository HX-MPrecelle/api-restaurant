const express = require("express");
const { getAllRestaurants } = require("../controller/controller");
const { Restaurant, Type, User } = require("../db");

const router = express.Router();

router.get("/", async (req, res) => {
  const { name } = req.query;
  const allRestaurants = await getAllRestaurants();
  // console.log(allRestaurants);
  try {
    if (name) {
      let restaurant = allRestaurants.filter((e) =>
        e.name.toLowerCase().includes(name.toLowerCase())
      );
      restaurant.length
        ? res.status(200).send(restaurant)
        : res.status(404).json({ message: "Restaurant no encontrado" });
    } else {
      return res.status(200).send(allRestaurants);
    }
  } catch (e) {
    return res.status(404).json({ message: "Petición inválida" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const allRestaurants = await getAllRestaurants();
  try {
    if (id) {
      let restaurant = allRestaurants.filter((e) => e.id == id);
      restaurant.length
        ? res.status(200).send(restaurant)
        : res.status(404).json({ message: "Restaurant no encontrado" });
    }
  } catch (e) {
    return res.status(404).json({ message: "Petición inválida" });
  }
});

router.post("/", async (req, res) => {
  const {
    name,
    address,
    neighborhood_info,
    cuisine,
    email,
    personas_max,
    photo,
    description,
    price,
    owner,
  } = req.body;
  try {
    if (name && email) {
      const allRestaurants = await getAllRestaurants();
      const restaurantName = allRestaurants.filter(
        (e) => e.name?.toLowerCase() === name?.toLowerCase()
      );
      const restaurantEmail = allRestaurants.filter(
        (e) => e.email?.toLowerCase() === email?.toLowerCase()
      );

      const userFind = await User.findOne({
        where: {
          email: owner,
        },
      });

      if (userFind) {
        if (!restaurantName.length && !restaurantEmail.length) {
          const restaurant = await Restaurant.create({
            name,
            address,
            neighborhood_info,
            cuisine,
            email,
            personas_max,
            photo,
            description,
            price,
            owner,
          });

          const cuisinesType = await Type.findAll({
            where: {
              name: cuisine,
            },
          });

          restaurant.addType(cuisinesType);
          return res.status(201).send(restaurant);
        } else {
          return res
            .status(406)
            .json({ message: "Nombre de restaurant o dueño no existe" });
        }
      }
      if (
        !name ||
        !address ||
        !neighborhood_info ||
        !cuisine ||
        !email ||
        !personas_max
      ) {
        return res.status(400).json({ message: "Información incompleta" });
      }
    } else {
      return res.status(404).json({ message: "Dueño inexistente" });
    }
  } catch (e) {
    return res.status(404).json({ message: "Petición inválida" });
  }
});

router.put("/:id", async (req, res) => {
  //id de restaurant, email de usuario loggeado
  const { id } = req.params;

  const {
    owner,
    name,
    address,
    neighborhood_info,
    cuisine,
    email,
    personas_max,
    photo,
    description,
    price,
  } = req.body;

  try {
    const restaurant = await Restaurant.findOne({
      where: {
        id,
        owner,
      },
    });
    if (restaurant) {
      const newRestaurant = await restaurant.update(
        {
          name: name ? name : restaurant.dataValues.name,
          address: address ? address : restaurant.dataValues.address,
          neighborhood_info: neighborhood_info
            ? neighborhood_info
            : restaurant.dataValues.neighborhood_info,
          cuisine: cuisine ? cuisine : restaurant.dataValues.cuisine,
          email: email ? email : restaurant.dataValues.email,
          personas_max: personas_max
            ? personas_max
            : restaurant.dataValues.personas_max,
          photo: photo ? photo : restaurant.dataValues.photo,
          description: description
            ? description
            : restaurant.dataValues.description,
          price: price ? price : restaurant.dataValues.price,
        },
        {
          where: {
            id,
          },
        }
      );
      res.status(200).send(newRestaurant);
    } else {
      res.status(400).json({
        message: "Solo el dueño puede modificar los datos del restaurant",
      });
    }
  } catch (e) {
    res.status(404).json({ message: "Petición inválida" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { owner } = req.body;

  try {
    const restaurant = await Restaurant.findOne({
      where: {
        id,
        owner,
      },
    });

    // console.log('Soy restaurant', restaurant);
    if (restaurant) {
      await restaurant.destroy();
      return res
        .status(200)
        .json({ message: "Restaurant eliminado con éxito" });
    }
    return res
      .status(400)
      .json({ message: "Solo el dueño puede eliminar el restaurant" });
  } catch (e) {
    return res.status(404).json({ message: "Petición inválida" });
  }
});

module.exports = router;
