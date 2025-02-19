module.exports = function(requiredRole) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: "Необходима аутентификация" });
        }

        if (req.user.role !== requiredRole) {
            return res.status(403).json({ error: "Доступ запрещен" });
        }
        
        next();
    };
};
