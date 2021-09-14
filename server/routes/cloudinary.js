const express = require("express");

// import controllers
const { upload, remove } = require("../controllers/cloudinary");

const router = express.Router();

//import middlewares
const {authCheck, adminCheck} = require("../middlewares/auth");


router.post("/uploadimages", authCheck, adminCheck, upload);
router.post("/removeimage", authCheck, adminCheck, remove);


module.exports = router;