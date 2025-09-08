// const multer = require('multer');

// const path = require('path');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + path.extname(file.originalname));
//   }
// });

// function checkFileType(file, cb) {
//   const filetypes = /jpeg|jpg|png|gif/;
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = filetypes.test(file.mimetype);
//   if (mimetype && extname) {
//     return cb(null, true);
//   } else {
//     cb('Error: Images Only!');
//   }
// }

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, 
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb);
//   }
// });

// module.exports = upload;
// upload.js
// upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

function upload(type) {
  const allowed = new Set(["category", "product", "profile", "others"]);
  const folder = allowed.has(type) ? type : "others";
  
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      const uploadPath = path.join(__dirname,"..", "uploads", folder);
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename(req, file, cb) {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    },
  });
  
  const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Images Only!"));
  };
  
  return multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter,
  });
}

module.exports = upload;
