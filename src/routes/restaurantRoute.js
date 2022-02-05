const express = require('express');
const { getAllRestaurants } = require('../controller/controller');
const { Restaurant, Type } = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
    const { name } = req.query;
    const allRestaurants = await getAllRestaurants();
    // console.log(allRestaurants);
    try {
        if (name) {
            let restaurant = allRestaurants.filter(e => e.name.toLowerCase().includes(name.toLowerCase()));
            restaurant.length ? res.status(200).send(restaurant) : res.status(404).send('Restaurant not found');
        } else {
            return res.status(200).send(allRestaurants);
        }
    } catch (e) {
        return res.status(404).send('Service unvailable');
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const allRestaurants = await getAllRestaurants();
    try {
        if (id) {
            let restaurant = allRestaurants.filter(e => e.id == id);
            restaurant.length ? res.status(200).send(restaurant) : res.status(404).send('Restaurant not found');
        }
    } catch (e) {
        console.log(e);
    }
});

router.post('/create', async (req, res) => {
    const {name, address, neighborhood_info, cuisine, email, personas_max, photo} = req.body;
    try {
        if (name && email) {
            const allRestaurants = await getAllRestaurants();
            const restaurantName = allRestaurants.filter(e => e.name?.toLowerCase() === name?.toLowerCase());
            const restaurantEmail = allRestaurants.filter(e => e.email?.toLowerCase() === email?.toLowerCase());
            if (!restaurantName.length && !restaurantEmail.length) {
                const restaurant = await Restaurant.create({
                    name,
                    address,
                    neighborhood_info,
                    cuisine,
                    email,
                    personas_max, 
                    photo
                });

                const cuisinesType = await Type.findAll({
                    where: {
                        name: cuisine,
                    }
                });

                restaurant.addType(cuisinesType);
                return res.status(201).send(restaurant);
            } else {
                return res.status(406).send('Restaurant name or email already exist');
            }
        }
        if (!name || !address || !neighborhood_info || !cuisine || !email || !personas_max) {
            return res.status(400).send('Data incomplete')
        }
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;