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
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/resource", authMiddleware, taskCreateValidation, createResource);
router.get("/resource", authMiddleware, getResources);
router.get("/resource/:id", authMiddleware, getResourceById);
router.put("/resource/:id", authMiddleware, taskUpdateValidation, updateResource);



router.delete("/resource/:id", authMiddleware, deleteResource);

module.exports = router;
