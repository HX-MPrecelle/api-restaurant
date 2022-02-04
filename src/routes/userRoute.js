const express = require('express');
const { User } = require('../db');

const router = express.Router();


router.post('/create', async (req, res) => {
    const {username, email, password} = req.body;
    try {
        if (username && email && password) {
            const allUser = await User.findAll();
            const userUsername = allUser.find(e => e.username.toLowerCase() === username.toLowerCase());
            const userEmail = allUser.find(e => e.email.toLowerCase() === email.toLowerCase());
            if (userUsername) return res.status(400).send('Username already exist');
            if (userEmail) return res.status(400).send('Email already exist');
            const newUser = await User.create({
                username,
                email,
                password
            });
            return res.status(200).send(newUser);
        } else {
            return res.status(400).send('Data incomplete');
        }
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;