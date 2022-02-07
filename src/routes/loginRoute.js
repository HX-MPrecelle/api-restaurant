//verificar que exista usuario sino mandar a registro y unicamente mandar respuesta al front con error o success tanto para login normal como para google
const express = require('express');
const { User } = require('../db');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/',  async (req, res) => {
    const {email, password} = req.body;
    
    if (!email || !password) {
        return res.status(400).send({message: 'Please enter all fields'})
    }
    
    try {
        const allUser = await User.findAll();
        const user = allUser.find(e => e.email.toLowerCase() === email.toLowerCase());
        console.log(user);
        if (user) {
            let passHash = bcrypt.compareSync(password, user.password);
            if (passHash) {
                var loggedUser = {
                    id: user.id,
                    username: user.username,
                    email: user.email
                }
                return res.status(200).send(loggedUser);   
            } else {
                return res.status(400).json({message: 'Passwords not match'});
            }
        } else {
            return res.status(404).json({message: 'Email is not valid'});
        }
    } catch (e) {
        console.log(e);
        return res.status(404).json({message: 'Not found'});
    }
});

module.exports = router;

