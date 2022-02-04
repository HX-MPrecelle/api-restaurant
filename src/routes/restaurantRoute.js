const express = require('express');
const { search } = require('../controller/controller');

const router = express.Router();

router.get('/', async (req, res) => {
    const allRestaurants = await search();
    try {
        const restaurants = allRestaurants;
        return res.status(200).send(restaurants);
    } catch (e) {
        console.log(e);
    }
})

module.exports = router;