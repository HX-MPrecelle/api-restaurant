const express = require("express");
const { getRestaurantsDb } = require("../controller/controller");
const { Restaurant, Type, User, Review, Reserve } = require("../db");

// SDK de Mercado Pago
const mercadopago = require("mercadopago");
// Agrega credenciales
mercadopago.configure({
  access_token:
    "APP_USR-949974469103397-021617-c4d2a1a6d9762d6e3d8359bc1cc68334-1075500074",
});

const router = express.Router();

//Traigo todos los restaurants y los cargo en la DB
router.get("/", async (req, res) => {
  try {
    const { name } = req.query;
    const allRestaurants = await getRestaurantsDb();
    // console.log(allRestaurants);
    if (name) {
      let restaurant = allRestaurants.filter((e) =>
        e.name.toLowerCase().includes(name.toLowerCase())
      );
      restaurant.length
        ? res.status(200).send(restaurant)
        : res.status(400).json({ message: "Restaurant no encontrado" });
    } else {
      return res.status(200).send(allRestaurants);
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Ocurrió algo inesperado" });
  }
});

//Traigo un restaurant por ID para el detalle completo
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allRestaurants = await getRestaurantsDb();
    if (id) {
      let restaurant = allRestaurants.find((e) => e.id == id);
      restaurant
        ? res.status(200).send(restaurant)
        : res.status(400).json({ message: "Restaurant no encontrado" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Ocurrió algo inesperado" });
  }
});

//Checkout mercadopago
router.post("/:id/checkout", async (req, res) => {
  try {
    // Crea un objeto de preferencia
    const { id } = req.params;
    const { date, pax } = req.body;
    let preference = {};

    preference = {
      items: [
        {
          title: "Reserva",
          unit_price: 100,
          quantity: parseInt(pax),
        },
      ],
      back_urls: {
        success: "http://localhost:3000/success",
        pending: "http://localhost:3000/failure",
        failure: "http://localhost:3000/failure",
      },
      auto_return: "approved",
    };
    if (date && pax) {
      const restaurant = await Restaurant.findOne({
        where: {
          id,
        },
      });

      const reserveDateRestaurant = await Reserve.findAll({
        where: {
          RestaurantId: restaurant.dataValues.id,
          date,
          status: "IN PROGRESS",
        },
      });

      var paxOccupedPerDay = 0;

      for (const reserve of reserveDateRestaurant) {
        paxOccupedPerDay += reserve.dataValues.pax;
      }
      // console.log(paxOccupedPerDay);

      var placesAvailable =
        restaurant.dataValues.personas_max -
        (paxOccupedPerDay > 0 ? paxOccupedPerDay : 0);

      if (placesAvailable >= pax) {
        mercadopago.preferences
          .create(preference)
          .then(function (response) {
            // console.log(response.body);
            res.status(200).json({ url: response.body.init_point });
          })
          .catch(function (error) {
            console.log(error);
          });
        // console.log(restaurant.dataValues);
      } else {
        if (placesAvailable > 0) {
          return res.status(400).json({
            message: `Solo nos quedan ${placesAvailable} lugares disponibles para la fecha solicitada`,
          });
        } else {
          return res.status(400).json({
            message: `No nos quedan lugares disponibles para la fecha solicitada`,
          });
        }
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Ocurrió algo inesperado" });
  }
});

//Creo una reserva
router.post("/:id/reserves", async (req, res) => {
  try {
    //email de usuario, date, time y pax de reserve, id de restaurant
    const { id } = req.params;
    const { email, date, time, pax } = req.body;
    if (email && date && time && pax && id) {
      const restaurant = await Restaurant.findOne({
        where: {
          id,
        },
      });
      //   console.log(restaurant.dataValues);

      const user = await User.findOne({
        where: {
          email,
        },
      });
      //   console.log(user.dataValues);

      const reserveDateRestaurant = await Reserve.findAll({
        where: {
          RestaurantId: restaurant.dataValues.id,
          date,
          status: "IN PROGRESS",
        },
      });

      var paxOccupedPerDay = 0;

      for (const reserve of reserveDateRestaurant) {
        paxOccupedPerDay += reserve.dataValues.pax;
      }
      // console.log(paxOccupedPerDay);

      var placesAvailable =
        restaurant.dataValues.personas_max -
        (paxOccupedPerDay > 0 ? paxOccupedPerDay : 0);

      if (placesAvailable >= pax) {
        if (restaurant && user) {
          if (restaurant.owner !== "API") {
            const reserve = await Reserve.create({
              date,
              time,
              pax,
              status: "IN PROGRESS",
              author: user.dataValues.username,
              restaurant: restaurant.dataValues.name,
              UserId: user.dataValues.id,
              RestaurantId: restaurant.dataValues.id,
            });
            // console.log(restaurant.dataValues);
            return res.status(201).send(reserve);
          } else {
            return res.status(400).json({
              message: "No se le pueden hacer reservas a este Restaurant",
            });
          }
        } else {
          return res
            .status(400)
            .json({ message: "Usuario/Restaurant no existe" });
        }
      } else {
        if (placesAvailable > 0) {
          return res.status(400).json({
            message: `Solo nos quedan ${placesAvailable} lugares disponibles para la fecha solicitada`,
          });
        } else {
          return res.status(400).json({
            message: `No nos quedan lugares disponibles para la fecha solicitada`,
          });
        }
      }
    } else {
      return res.status(400).json({ message: "Faltan rellenar campos" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Ocurrió algo inesperado" });
  }
});

//Traigo todas las reservas de un restaurant
router.get("/:id/reserves", async (req, res) => {
  try {
    //id de restaurant
    const { id } = req.params;
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
      return res.status(401).json({
        message: "Hace falta el ID del restaurant para encontrar sus reservas",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Ocurrió algo inesperado" });
  }
});

//Creo un review de un restaurant
router.post("/:id/reviews", async (req, res) => {
  try {
    const { id } = req.params;
    const { email, rating, description } = req.body;
    if (email && rating && description && id) {
      if (
        rating === "1" ||
        rating === "2" ||
        rating === "3" ||
        rating === "4" ||
        rating === "5"
      ) {
        const restaurant = await Restaurant.findOne({
          where: {
            id,
          },
        });
        //   console.log(restaurant[0].dataValues);

        const user = await User.findOne({
          where: {
            email,
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
        return res
          .status(401)
          .json({ message: "El rating debe ser un número entero entre 1 y 5" });
      }
    } else {
      return res.status(401).json({ message: "Datos incompletos" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Ocurrió algo inesperado" });
  }
});

//Traigo todas las review de un restaurant
router.get("/:id/reviews", async (req, res) => {
  try {
    //id de restaurant
    const { id } = req.params;
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
      return res.status(401).json({
        message: "Hace falta el ID del restaurant para encontrar sus reseñas",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Ocurrió algo inesperado" });
  }
});

//Creo un restaurant
router.post("/", async (req, res) => {
  try {
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
    if (name && email) {
      const allRestaurants = await getRestaurantsDb();
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
            status: "ENABLED",
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
            .status(403)
            .json({ message: "El nombre del restaurant o su email ya existe" });
        }
      } else {
        return res.status(401).json({
          message: "Debes estar registrado para poder crear un restaurant",
        });
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
      return res.status(401).json({ message: "Información incompleta" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Ocurrió algo inesperado" });
  }
});

//Modifico datos del restaurant existente
router.put("/:id", async (req, res) => {
  try {
    //id de restaurant, email de usuario loggeado
    const { id } = req.params;

    const {
      name,
      address,
      rating,
      neighborhood_info,
      cuisine,
      email,
      personas_max,
      photo,
      description,
      price,
    } = req.body;
    const restaurant = await Restaurant.findOne({
      where: {
        id,
      },
    });
    if (restaurant) {
      const newRestaurant = await restaurant.update(
        {
          name: name ? name : restaurant.dataValues.name,
          address: address ? address : restaurant.dataValues.address,
          rating: rating ? rating : restaurant.dataValues.rating,
          neighborhood_info: neighborhood_info
            ? neighborhood_info
            : restaurant.dataValues.neighborhood_info,
          cuisine: cuisine ? cuisine : restaurant.dataValues.cuisine,
          email: email ? email : restaurant.dataValues.email,
          personas_max: personas_max
            ? personas_max
            : restaurant.dataValues.personas_max,
          photo: photo
            ? restaurant.dataValues.photo.concat(photo)
            : restaurant.dataValues.photo,
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
        message: "No se encuentra el restaurant",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Ocurrió algo inesperado" });
  }
});

//Deshabilito restaurant por id
router.put("/:id/disabled", async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({
      where: {
        id,
      },
    });
    if (restaurant) {
      await restaurant.update(
        {
          status: "DISABLED",
        },
        {
          where: {
            id,
          },
        }
      );
      res.status(200).json({
        message: `El restaurant '${restaurant.dataValues.name}' fué deshabilitado con éxito`,
      });
    } else {
      res.status(400).json({
        message: "No se encuentra el restaurant para deshabilitarlo",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Ocurrió algo inesperado" });
  }
});

//Habilito restaurant por id
router.put("/:id/enabled", async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({
      where: {
        id,
      },
    });
    if (restaurant) {
      await restaurant.update(
        {
          status: "ENABLED",
        },
        {
          where: {
            id,
          },
        }
      );
      res.status(200).json({
        message: `El restaurant '${restaurant.dataValues.name}' fué habilitado nuevamente`,
      });
    } else {
      res.status(400).json({
        message: "No se encuentra el restaurant para habilitarlo",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Ocurrió algo inesperado" });
  }
});

module.exports = router;
