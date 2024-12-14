const asyncHandle = require("../middleware/asyncHandle");
const { product } = require("../models");
const fs = require("fs");
const { Op } = require("sequelize");

exports.addProduct = asyncHandle(async (req, res) => {
  let { name, description, price, category_id, stock } = req.body;

  const file = req.file;
  if (!file) {
    res.status(400);
    throw new Error("Tidak ada image yang diinput");
  }

  const filename = file.filename;
  const pathFile = `${req.protocol}://${req.get("host")}/public/uploads/${filename}`;

  const newProduct = await product.create({
    name,
    description,
    price,
    category_id,
    image: pathFile,
    stock,
  });

  return res.status(200).json({
    data: newProduct,
  });
});

exports.readProduct = asyncHandle(async (req, res) => {
  const { search, limit, page } = req.query;
  let productData = "";
  if (search || limit || page) {
    const limitData = limit * 1 || 100;
    const pageData = page * 1 || 1;
    const searchData = search || "";
    const offsetData = (pageData - 1) * limitData;

    const products = await product.findAndCountAll({
      limit: limitData,
      offset: offsetData,
      where: {
        name: {
          [Op.like]: "%" + searchData + "%",
        },
      },
    });
    productData = products;
  } else {
    const products = await product.findAndCountAll();
    productData = products;
  }
  return res.status(200).json({
    status: "success",
    data: productData,
  });
});

exports.detailProduct = asyncHandle(async (req, res) => {
  const { id } = req.params;

  const productData = await product.findByPk(id);

  if (!productData) {
    res.status(404);
    throw new Error("product id not found");
  }
  return res.status(200).json({
    status: "success",
    data: productData,
  });
});

exports.updateProduct = asyncHandle(async (req, res) => {
  const { id } = req.params;
  let { name, price, description, stock, category_id } = req.body;

  const productData = await product.findByPk(id);

  if (!productData) {
    res.status(404);
    throw new Error("product id not found");
  }

  const file = req.file;

  if (file) {
    const nameImage = productData.image.replace(`${req.protocol}://${req.get("host")}/public/uploads`, "");
    const filePath = `./public/uploads/${nameImage}`;
    fs.unlink(filePath, (err) => {
      if (err) {
        res.status(400);
        throw new Error("file tidak ditemukan");
      }
    });
    const filename = file.filename;
    const pathFile = `${req.protocol}://${req.get("host")}/public/uploads/${filename}`;

    productData.image = pathFile;
  }
  productData.name = name || productData.name;
  productData.price = price || productData.price;
  productData.stock = stock || productData.stock;
  productData.category_id = category_id || productData.category_id;
  productData.description = description || productData.description;

  productData.save();

  return res.status(200).json({
    status: "success",
    data: productData,
  });
});

exports.destroyProduct = asyncHandle(async (req, res) => {
  const { id } = req.params;

  const productData = await product.findByPk(id);

  if (!productData) {
    res.status(404);
    throw new Error("product id not found");
  } else {
    // ambil file gambar
    const nameImage = productData.image.replace(`${req.protocol}://${req.get("host")}/public/uploads`, "");
    // tempat file gambar
    const filePath = `./public/uploads/${nameImage}`;
    // fungsi untuk menghapus gambar
    fs.unlink(filePath, (err) => {
      if (err) {
        res.status(400);
        throw new Error("file tidak ditemukan");
      }
      productData.destroy();

      return res.status(200).json({
        status: "success",
        message: "Data berhasil dihapus",
      });
    });
  }
});
