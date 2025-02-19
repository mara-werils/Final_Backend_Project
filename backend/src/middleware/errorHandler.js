module.exports = (err, req, res, next) => {
    console.error("Глобальная ошибка:", err.stack);
    if (res.headersSent) {
        return next(err);
    }
    res.status(res.statusCode !== 200 ? res.statusCode : 500).json({
        error: err.message || "Internal Server Error"
    });
};
