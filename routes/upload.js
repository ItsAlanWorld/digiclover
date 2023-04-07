const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const Docu = require('../models/docu');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('Create upload folder');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 100 * 1024 * 1024 },
});

router.post('/docu', upload.single('docu'), async (req, res, next) => {
  console.log(req.file);

  const { file } = req;
  const fileBuffer = fs.readFileSync(`./uploads/${file.filename}`);
  const sum = crypto.createHash('sha256');
  sum.update(fileBuffer);
  const hex = sum.digest('hex');

  try {
    await Docu.create({
      title: file.originalname,
      file: file.filename,
      hash: hex,
      kab: 1,
      eul: 2,
    });
    return res.redirect('/uploadComplete');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
