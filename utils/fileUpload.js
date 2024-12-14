const multer = require("multer");

const FILE_TYPE = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
};
const storageFile = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValidFormat = FILE_TYPE[file.mimetype];
    let uploadError = new Error("invalid image type");

    if (isValidFormat) {
      uploadError = null;
    }
    cb(uploadError, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const extentionFile = FILE_TYPE[file.mimetype];
    const uniqueFileImage = `${file.fieldname}-${Date.now()}.${extentionFile}`;
    cb(null, uniqueFileImage);
  },
});

exports.uploadOption = multer({ storage: storageFile });
