const express = require("express");
const { User } = require("../db");
const bcrypt = require("bcryptjs");

const router = express.Router();

router.post("/create", async (req, res) => {
  const { username, email, password, password2 } = req.body;

  let errors = [];

  if (!username || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password.length < 6) {
    errors.push({ message: "Password should be at least 6 characters" });
  }

  if (password != password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length) {
    return res.status(400).send(errors);
  }

  try {
    const allUser = await User.findAll();
    const userUsername = allUser.find(
      (e) => e.username.toLowerCase() === username.toLowerCase()
    );
    const userEmail = allUser.find(
      (e) => e.email.toLowerCase() === email.toLowerCase()
    );
    if (userUsername) return res.status(400).send("Username already exist");
    if (userEmail) return res.status(400).send("Email already exist");
    //Hasheo la password para enviarla de forma segura a la DB, el segundo parametro son las vueltas de encriptación que queremos darle.
    let hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(200).send(newUser);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
