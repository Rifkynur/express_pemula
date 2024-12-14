const { where } = require("sequelize");
const asyncHandle = require("../middleware/asyncHandle");
const { profile } = require("../models");

exports.updateOrCreateProfile = asyncHandle(async (req, res) => {
  const { age, bio, address } = req.body;
  const idUser = req.user.id;

  const userData = await profile.findOne({ where: { user_id: idUser } });

  let message;
  if (userData) {
    await profile.update(
      {
        age: age || userData.age,
        bio: bio || userData.bio,
        address: address || userData.address,
      },
      {
        where: {
          user_id: idUser,
        },
      }
    );
    message = "profile berhasil diubah";
  } else {
    await profile.create({
      age,
      bio,
      address,
      user_id: idUser,
    });
    message = "profile berhasil dibuat";
  }
  return res.status(201).json({
    status: "success",
    message,
  });
});
