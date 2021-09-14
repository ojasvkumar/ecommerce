const express = require("express");

// import controllers
const { create, listAll, remove, read, searchFilters, update, list, listRelated , productsCount, productStar } = require("../controllers/product");

const router = express.Router();

//import middlewares

const {authCheck, adminCheck} = require("../middlewares/auth");


router.post("/product", authCheck, adminCheck, create);
router.get("/products/total", productsCount);
router.get("/products/:count", listAll);
router.get("/product/:slug", read);
router.put("/product/:slug", authCheck, adminCheck, update);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.post("/products", list);

//rating route
router.put("/product/star/:productId", authCheck, productStar);

//related products route
router.get("/product/related/:productId", listRelated);

//search
router.post("/search/filters", searchFilters);


module.exports = router;