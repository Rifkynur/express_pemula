const express = require("express");
const router = express.Router();
const { addProduct, readProduct, detailProduct, updateProduct, destroyProduct } = require("../controllers/productController");
const { uploadOption } = require("../utils/fileUpload");
const { authMiddleware, permissionUser } = require("../middleware/userMiddleware");

router.post("/", uploadOption.single("image"), addProduct);
router.put("/:id", uploadOption.single("image"), updateProduct);
router.delete("/:id", destroyProduct);

router.get("/", readProduct);
router.get("/:id", detailProduct);

module.exports = router;
