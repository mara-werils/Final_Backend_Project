const express = require("express");
const {
    createResource,
    getResources,
    getResourceById,
    updateResource,
    deleteResource
} = require("../controllers/resourceController");
const authMiddleware = require("../middleware/authMiddleware");
const {
    taskCreateValidation,
    taskUpdateValidation
} = require("../middleware/validation");
// Пример roleMiddleware, если ты используешь роли (admin/user)
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/resource", authMiddleware, taskCreateValidation, createResource);
router.get("/resource", authMiddleware, getResources);
router.get("/resource/:id", authMiddleware, getResourceById);
router.put("/resource/:id", authMiddleware, taskUpdateValidation, updateResource);

// Если нужно, чтобы только "admin" мог удалять любую задачу, расскоментируй roleMiddleware("admin")
// router.delete("/resource/:id", authMiddleware, roleMiddleware("admin"), deleteResource);

router.delete("/resource/:id", authMiddleware, deleteResource);

module.exports = router;
