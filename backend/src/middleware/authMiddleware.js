const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Доступ запрещен, токен не найден" });
        }

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: "Недействительный или истекший токен" });
            }

            req.user = decoded;
            next();
        });
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
};
