const express = require("express");

// import controllers
const {createOrUpdateUser, currentUser} = require("../controllers/auth");

const router = express.Router();

//import middlewares

const {authCheck, adminCheck} = require("../middlewares/auth");

router.all("/create-or-update-user", authCheck, createOrUpdateUser);
router.all("/current-user", authCheck, currentUser);
router.all("/current-admin", authCheck, adminCheck, currentUser);

module.exports = router;