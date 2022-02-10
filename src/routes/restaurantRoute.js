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
        : res.status(404).send("Restaurant not found");
    } else {
      return res.status(200).send(allRestaurants);
    }
  } catch (e) {
    return res.status(404).send("Service unvailable");
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
        : res.status(404).send("Restaurant not found");
    }
  } catch (e) {
    console.log(e);
  }
});

router.post("/create", async (req, res) => {
  const {
    name,
    address,
    neighborhood_info,
    cuisine,
    email,
    personas_max,
    photo,
    owner,
  } = req.body;
  try {
    const restaurantOwner = await User.findAll({
      where: {
        email: owner,
      },
    });
    // console.log(restaurantOwner);

    if (name && email) {
      const allRestaurants = await getAllRestaurants();
      const restaurantName = allRestaurants.filter(
        (e) => e.name?.toLowerCase() === name?.toLowerCase()
      );
      const restaurantEmail = allRestaurants.filter(
        (e) => e.email?.toLowerCase() === email?.toLowerCase()
      );
      if (!restaurantName.length && !restaurantEmail.length) {
        const restaurant = await Restaurant.create({
          name,
          address,
          neighborhood_info,
          cuisine,
          email,
          personas_max,
          photo,
          owner: restaurantOwner[0].dataValues.email,
        });

        const cuisinesType = await Type.findAll({
          where: {
            name: cuisine,
          },
        });

        restaurant.addType(cuisinesType);
        return res.status(201).send(restaurant);
      } else {
        return res.status(406).send("Restaurant name or email already exist");
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
      return res.status(400).send("Data incomplete");
    }
  } catch (e) {
    console.log(e);
  }
});

router.put("/", async (req, res) => {
  //id de restaurant, email de usuario loggeado
  const {
    idRestaurant,
    emailOwner,
    newName,
    newAddress,
    newNeighborhood,
    newCuisine,
    newEmail,
    newPersonas_max,
    newPhoto,
    newDescription,
    newPrice,
  } = req.body;

  try {
    const restaurant = await Restaurant.findOne({
      where: {
        id: idRestaurant,
        owner: emailOwner,
      },
    });
    if (restaurant) {
      const newRestaurant = await restaurant.update(
        {
          name: newName ? newName : restaurant.dataValues.name,
          address: newAddress ? newAddress : restaurant.dataValues.address,
          neighborhood_info: newNeighborhood
            ? newNeighborhood
            : restaurant.dataValues.neighborhood_info,
          cuisine: newCuisine ? newCuisine : restaurant.dataValues.cuisine,
          email: newEmail ? newEmail : restaurant.dataValues.email,
          personas_max: newPersonas_max
            ? newPersonas_max
            : restaurant.dataValues.personas_max,
          photo: newPhoto ? newPhoto : restaurant.dataValues.photo,
          description: newDescription
            ? newDescription
            : restaurant.dataValues.description,
          price: newPrice ? newPrice : restaurant.dataValues.price,
        },
        {
          where: {
            id: idRestaurant,
          },
        }
      );
      res.status(200).send(newRestaurant);
    } else {
      res.status(400).send({
        message: "Solo el dueño puede modificar los datos del restaurant",
      });
    }
  } catch (e) {
    res.status(404).send({ message: "Petición inválida" });
  }
});

router.delete("/", async (req, res) => {
  const { emailOwner, idRestaurant } = req.body;

  try {
    const restaurant = await Restaurant.findOne({
      where: {
        id: idRestaurant,
        owner: emailOwner,
      },
    });

    // console.log('Soy restaurant', restaurant);
    if (restaurant) {
      await restaurant.destroy();
      return res.status(200).send({message: 'Restaurant eliminado con éxito'});
    }
    return res
      .status(400)
      .send({ message: "Solo el dueño puede eliminar el restaurant" });
  } catch (e) {
    return res.status(404).send({ message: "Petición inválida" });
  }
});

module.exports = router;
