//verificar que exista usuario sino mandar a registro y unicamente mandar respuesta al front con error o success tanto para login normal como para google
const express = require("express");
const { User } = require("../db");
const bcrypt = require("bcryptjs");

const router = express.Router();

//Login común
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Por favor, complete los campos" });
    }
    const allUser = await User.findAll();
    const user = allUser.find(
      (e) => e.email.toLowerCase() === email.toLowerCase()
    );
    // console.log(user);
    if (user) {
      let passHash = bcrypt.compareSync(password, user.password);
      if (passHash) {
        var loggedUser = {
          id: user.id,
          username: user.username,
          email: user.email,
        };
        return res.status(200).send(loggedUser);
      } else {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }
    } else {
      return res.status(401).json({ message: "El usuario no existe" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Ocurrió algo inesperado" });
  }
});

//Login con Google
router.post("/google", async (req, res) => {
  try {
    const { email, id } = req.body;

    if (!email || !id) {
      return res.status(401).json({ message: "Por favor, ingresa nuevamente" });
    }
    const allUser = await User.findAll();
    const user = allUser.find(
      (e) => e.email.toLowerCase() === email.toLowerCase()
    );
    // console.log(user);
    if (user) {
      return res
        .status(200)
        .json({ id: user.id, email: user.email, username: user.username });
    } else {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Ocurrió algo inesperado" });
  }
});

module.exports = router;
