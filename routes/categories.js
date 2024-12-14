const express = require("express");
const router = express.Router();
const { getAllCategories, storeCategory, detailCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const { authMiddleware, permissionUser } = require("../middleware/userMiddleware");

router.get("/", getAllCategories);
router.get("/:id", detailCategory);

router.post("/", authMiddleware, permissionUser("admin"), storeCategory);

router.put("/:id", authMiddleware, permissionUser("admin", "user"), updateCategory);

router.delete("/:id", authMiddleware, permissionUser("admin"), deleteCategory);

module.exports = router;
