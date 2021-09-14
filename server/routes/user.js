const express = require("express");

const router = express.Router();

//import middlewares
const {authCheck} =  require('../middlewares/auth');

//import controllers
const {userCart, getUserCart, createOrder, createCashOrder, addToWishlist, wishlist, removeFromWishlist, getOrders, emptyCart, saveAddress, applyCouponToUserCart} = require('../controllers/user');

router.get("/user", (req,res)=>{
	res.send("User API");
});
router.post('/user/cart', authCheck, userCart);
router.post('/user/address', authCheck, saveAddress);
router.get('/user/cart', authCheck, getUserCart);
router.delete('/user/cart', authCheck, emptyCart);

//coupon
router.post('/user/coupon', authCheck, applyCouponToUserCart);

//order
router.post('/user/cart/order', authCheck, createOrder); //stripe
router.post('/user/cash-order', authCheck, createCashOrder); //COD
router.get('/user/orders', authCheck, getOrders);

//wishlist
router.post('/user/wishlist', authCheck, addToWishlist);
router.get('/user/wishlist', authCheck, wishlist);
router.put('/user/wishlist/:productId', authCheck, removeFromWishlist)

module.exports = router;0