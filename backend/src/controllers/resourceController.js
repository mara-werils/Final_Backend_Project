const Resource = require("../models/Resource");

// 📌 Создание нового ресурса (задачи)
exports.createResource = async (req, res) => {
    try {
        const { title, dueDate } = req.body;

        if (!title) {
            return res.status(400).json({ error: "Название задачи обязательно" });
        }

        let formattedDueDate = null;
        if (dueDate) {
            const parsedDate = new Date(dueDate);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ error: "Некорректный формат даты" });
            }
            formattedDueDate = parsedDate;
        }

        const resource = new Resource({
            title,
            dueDate: formattedDueDate,
            user: req.user.id
        });

        await resource.save();
        res.status(201).json(resource);
    } catch (err) {
        console.error("Ошибка создания ресурса:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

// 📌 Получение всех ресурсов (с учетом ролей)
exports.getResources = async (req, res) => {
    try {
        let query = {};

        // ✅ Админ получает все задачи, пользователь — только свои
        if (req.user.role !== "admin") {
            query.user = req.user.id;
        }

        const resources = await Resource.find(query).populate("user", "username email");
        res.json(resources);
    } catch (err) {
        console.error("Ошибка получения ресурсов:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

// 📌 Получение ресурса по ID (учет ролей)
exports.getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id).populate("user", "username email");

        if (!resource) {
            return res.status(404).json({ error: "Ресурс не найден" });
        }

        // ✅ Только админ или владелец могут просматривать задачу
        if (req.user.role !== "admin" && resource.user._id.toString() !== req.user.id) {
            return res.status(403).json({ error: "Доступ запрещен" });
        }

        res.json(resource);
    } catch (err) {
        console.error("Ошибка получения ресурса по ID:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

// 📌 Обновление ресурса (только админ или владелец)
exports.updateResource = async (req, res) => {
    try {
        const { title, status, dueDate } = req.body;

        if (!title && !status && !dueDate) {
            return res.status(400).json({ error: "Необходимо передать хотя бы одно поле для обновления" });
        }

        const validStatuses = ["pending", "in-progress", "completed"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ error: "Недопустимый статус задачи" });
        }

        let formattedDueDate = null;
        if (dueDate) {
            const parsedDate = new Date(dueDate);
            if (isNaN(parsedDate.getTime())) {
                return res.status(400).json({ error: "Некорректный формат даты" });
            }
            formattedDueDate = parsedDate;
        }

        const updatedResource = await Resource.findById(req.params.id);

        if (!updatedResource) {
            return res.status(404).json({ error: "Ресурс не найден" });
        }

        // ✅ Только админ или владелец могут обновлять задачу
        if (req.user.role !== "admin" && updatedResource.user.toString() !== req.user.id) {
            return res.status(403).json({ error: "Доступ запрещен" });
        }

        updatedResource.title = title || updatedResource.title;
        updatedResource.status = status || updatedResource.status;
        updatedResource.dueDate = formattedDueDate || updatedResource.dueDate;

        await updatedResource.save();

        res.json(updatedResource);
    } catch (err) {
        console.error("Ошибка обновления ресурса:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};

// 📌 Удаление ресурса (только админ или владелец)
exports.deleteResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ error: "Ресурс не найден" });
        }

        // ✅ Админ может удалить любую задачу, пользователь — только свою
        if (req.user.role !== "admin" && resource.user.toString() !== req.user.id) {
            return res.status(403).json({ error: "Доступ запрещен" });
        }

        await Resource.findByIdAndDelete(req.params.id);
        res.json({ message: "Ресурс удален" });
    } catch (err) {
        console.error("Ошибка удаления ресурса:", err);
        res.status(500).json({ error: "Ошибка сервера" });
    }
};
