"use strict";
const { Model } = require("sequelize");
const { Sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: "name product sudah ada, masukan nama yang lain",
        },
        validate: {
          notNull: {
            msg: "data name product tidak boleh kosong",
          },
        },
      },
      description: DataTypes.STRING,
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
        validate: {
          notNull: {
            msg: "data price product tidak boleh kosong",
          },
        },
      },
      category_id: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "data category id tidak boleh kosong",
          },
          isExist(value) {
            return sequelize.models.category.findByPk(value).then((el) => {
              if (!el) {
                throw new Error("category tidak ditemukan");
              }
            });
          },
        },
        isInt: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "data image tidak boleh kosong",
          },
        },
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      countReview: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "product",
    }
  );
  return product;
};
