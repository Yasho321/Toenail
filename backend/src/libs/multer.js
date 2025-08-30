// middleware/upload.js
import multer from "multer";
import path from "path";
import fs from "fs-extra";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("uploads");
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => cb(null, file.originalname),
});

export const uploadOne  = multer({ storage }).single("file");
