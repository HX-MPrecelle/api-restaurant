const express = require("express");
const { Restaurant, Reserve } = require("../db");

const router = express.Router();

//Modifico estado de la reserva de IN PROGRESS -> FINISHED
router.put("/:id", async (req, res) => {
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
      if (reserve.status === "IN PROGRESS") {
        // console.log('Reserva previo', reserve);
        await reserve.update(
          {
            status: "FINISHED",
          },
          {
            where: {
              id: id,
            }
          }
        )
        // console.log('Restaurant post', restaurant.dataValues);
        return res.status(200).json({ message: "La reserva fué finalizada con éxito" });      
      } else {
        return res.status(400).json({ message: "La reserva ya caducó" })
      }
      // console.log(updatedRestaurant);
    }
    return res
      .status(400)
      .json({ message: "No se ha podido encontrar la reserva" });
  } catch (e) {
    return res.status(404).json({ message: "Petición inválida" });
  }
});

module.exports = router;
