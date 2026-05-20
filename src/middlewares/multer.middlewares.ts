import fs from "fs";
import path from "path";
import multer from "multer";
export const multerUploader = () => {
  const uploadFolder = path.join(process.cwd(), "uploads");
  const filesize = 10 * 1024 * 1024;
  if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder, { recursive: true });
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

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: filesize,
    },
  });
  return upload;
};
