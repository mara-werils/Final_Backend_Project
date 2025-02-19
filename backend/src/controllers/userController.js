const User = require("../models/User");

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { username, email } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { username, email },
            { new: true, select: "-password" }
        );

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: "Ошибка сервера" });
    }
};
