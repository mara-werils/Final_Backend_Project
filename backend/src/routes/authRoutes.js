const express = require("express");
const { register, login } = require("../controllers/authController");
const { registerValidation, loginValidation } = require("../middleware/validation");

const router = express.Router();

router.get("/register", (req, res) => {
    res.render("register", { title: "Регистрация" });
});

router.get("/login", (req, res) => {
    res.render("login", { title: "Вход" });
});

router.post("/register", register);

router.post("/login", login);

module.exports = router;
