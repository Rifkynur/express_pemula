const { where } = require("sequelize");
const { category } = require("../models");
const asyncHandle = require("../middleware/asyncHandle");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await category.findAll();
    return res.status(200).json({
      status: "success",
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      error: "server down",
    });
  }
};

exports.storeCategory = asyncHandle(async (req, res) => {
  const { name, description } = req.body;

  const newCategory = await category.create({ name, description });
  return res.status(201).json({
    status: "Success",
    data: newCategory,
    message: "validasi berhasil",
  });
});

exports.detailCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const categoryById = await category.findByPk(id);

    if (!categoryById) {
      return res.status(404).json({
        status: "failed",
        error: "data id tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      data: categoryById,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      error: "server down",
    });
  }
};

exports.updateCategory = asyncHandle(async (req, res) => {
  const { id } = req.params;
  await category.update(req.body, {
    where: {
      id,
    },
  });
  const newCategory = await category.findByPk(id);

  if (!newCategory) {
    res.status(404);
    throw new Error("category not found");
  }
  return res.status(201).json({
    status: "success",
    data: newCategory,
  });
});

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const idCategory = await category.findByPk(id);
    if (!idCategory) {
      return res.status(404).json({
        status: "failed",
        error: "data tidak ditemkan",
      });
    }
    const deletedCategory = await category.destroy({
      where: {
        id,
      },
    });

    return res.status(201).json({
      status: "success",
      message: "berhasil menghapus data",
    });
  } catch (error) {
    res.status(500).json({
      status: "failed",
      message: "invalid database",
    });
  }
};
