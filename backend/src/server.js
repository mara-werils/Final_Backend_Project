require("dotenv").config();
const app = require("./app");  
const mongoose = require("mongoose");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; // Теперь берем URI из .env

if (!MONGO_URI) {
    console.error("⛔ Ошибка: MONGO_URI не задан в .env");
    process.exit(1);
}

mongoose
    .connect(MONGO_URI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
    .then(() => {
        console.log("✅ Успешное подключение к MongoDB Atlas");
        app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
    })
    .catch((err) => {
        console.error("⛔ Ошибка подключения к MongoDB:", err);
        process.exit(1);
    });
