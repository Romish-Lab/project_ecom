import fs from "fs";
import path from "path";
import multer from "multer";

import AppError from "../utils/appError.utils";

export const multerUploader = () => {
  const uploadFolder = path.join(process.cwd(), "uploads");

  const filesize = 10 * 1024 * 1024;

  //* create uploads folder
  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, {
      recursive: true,
    });
  }

  //* multer storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadFolder);
    },

    filename: function (req, file, cb) {
      const uniqueName = Date.now() + "-" + file.originalname;

      cb(null, uniqueName);
    },
  });

  //* file filter
  const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
    const allowedExtensions = /png|jpg|jpeg|webp|pdf/;

    const allowedMimeType = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/webp",
      "application/pdf",
    ];

    const extName = allowedExtensions.test(
      path.extname(file.originalname).toLowerCase(),
    );

    const isAllowedMimeType = allowedMimeType.includes(file.mimetype);

    if (extName && isAllowedMimeType) {
      cb(null, true);
    } else {
      const error = new AppError(
        "Only image (png,jpg,jpeg,webp) and pdf are allowed",
        400,
      );

      cb(error);
    }
  };

  //*  multerupload API
  const upload = multer({
    storage,
    fileFilter,
    limits: {
      fileSize: filesize,
    },
  });

  return upload;
};
