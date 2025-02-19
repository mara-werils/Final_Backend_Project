const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ Успешное подключение к MongoDB Atlas");
    } catch (err) {
        console.error("⛔ Ошибка подключения к MongoDB:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
