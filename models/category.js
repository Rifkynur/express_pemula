"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  category.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          arg: true,
          msg: "name kategori sudah ada silakan masukan kategori lain",
        },
        validate: {
          notNull: {
            arg: true,
            msg: "name tidak boleh kosong",
          },
        },
      },
      description: DataTypes.TEXT,
    },
    {
      hooks: {
        afterValidate: (category, options) => {
          if (category.name) {
            category.name = category.name.toLowerCase();
          }
        },
      },
      sequelize,
      modelName: "category",
    }
  );
  return category;
};
