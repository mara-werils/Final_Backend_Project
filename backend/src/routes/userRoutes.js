const express = require("express");
const { getProfile, updateProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users/profile", authMiddleware, (req, res) => {
    console.log("Запрос к `/users/profile`. Пользователь:", req.user);
    getProfile(req, res);
});

router.put("/users/profile", authMiddleware, (req, res) => {
    console.log("Запрос на обновление профиля. Пользователь:", req.user);
    updateProfile(req, res);
});

router.get("/dashboard", (req, res) => {
    console.log("Запрос к `/dashboard`");
    res.render("dashboard");
});

module.exports = router;


router.get("/logout", (req, res) => {
    console.log("Пользователь вышел из системы");
    res.clearCookie("token");
    res.redirect("/login");
});
