const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "Заполните все поля" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Пользователь уже существует" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || "user"
        });

        await newUser.save();
        res.status(201).json({ message: "Регистрация успешна" });
    } catch (err) {
        console.error("Ошибка регистрации:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Введите email и пароль" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Неверные учетные данные" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Неверные учетные данные" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error("Ошибка при логине:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};
