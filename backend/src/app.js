require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const path = require("path");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const mainRoutes = require("./routes/mainRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true })); 
app.use(morgan("dev"));
app.use(methodOverride("_method"));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase",
            crypto: {
                secret: process.env.SESSION_SECRET || "secret"
            }
        }),
        cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }
    })
);


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(mainRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(resourceRoutes);

app.use(errorHandler);
app.use((err, req, res, next) => {
    console.error("❌ Ошибка сервера:", err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
