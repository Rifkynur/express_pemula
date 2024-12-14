"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  profile.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan data tidak boleh kosong",
          },
        },
      },
      bio: DataTypes.TEXT,
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan data tidak boleh kosong",
          },
        },
      },
      image: DataTypes.STRING,
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notNull: {
            msg: "inputan data tidak boleh kosong",
          },
          isExist(value) {
            return sequelize.models.user.findByPk(value).then((el) => {
              if (!el) {
                throw new Error("user id tidak ditemukan");
              }
            });
          },
        },
      },
    },
    {
      sequelize,
      modelName: "profile",
    }
  );
  return profile;
};
