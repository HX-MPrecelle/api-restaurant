const express = require('express');
const { getAllRestaurants } = require('../controller/controller');

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

module.exports = router;