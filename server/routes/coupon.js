const express = require("express");

// import controllers
const { create, remove, list } = require("../controllers/coupon");

const router = express.Router();

//import middlewares

const {authCheck, adminCheck} = require("../middlewares/auth");


router.post("/coupon", authCheck, adminCheck, create);
router.get("/coupons", authCheck, adminCheck, list);
router.delete("/coupon/:couponId", authCheck, adminCheck, remove);

module.exports = router;