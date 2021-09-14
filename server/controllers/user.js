const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Coupon = require('../models/coupon');
const Order = require('../models/order');
const { v4: uuidv4 } = require('uuid');

exports.userCart = async (req,res) => {
	const {cart} = req.body;
	
	let products = [];
	
	const user = await User.findOne({email: req.user.email}).exec();
	
	let cartExistByThisUser = await Cart.findOne({orderedBy: user._id}).exec();
	
	if(cartExistByThisUser){
		await cartExistByThisUser.remove();
		console.log('old cart removed');
	}
	
	for(let i = 0; i < cart.length; i++){
		let obj = {};
		obj.product = cart[i]._id;
		obj.count = cart[i].count;
		obj.color = cart[i].color;
		
		let {price} = await Product.findById(cart[i]._id).select('price').exec();
		obj.price = price;
		products.push(obj);
	}
	
	let cartTotal = 0;
	
	for(let i = 0 ; i < products.length ; i++){
		cartTotal += products[i].price * products[i].count;
	}
	//console.log(cartTotal)
	
	let newCart = await new Cart({
		products,
		cartTotal,
		orderedBy: user._id
	}).save();
	
	res.json({ok : true});
};

exports.getUserCart = async (req, res) => {
	const user = await User.findOne({email: req.user.email}).exec();

	const cart = await Cart.findOne({orderedBy: user._id})
		.populate('products.product')
		.exec();
	
	const {products, cartTotal, totalAfterDiscount} = cart;
	
	res.json({products, cartTotal, totalAfterDiscount});
};

exports.emptyCart = async (req, res) => {
	
	const user = await User.findOne({email: req.user.email}).exec();
	
	const cart = await Cart.findOneAndRemove({orderedBy: user._id}).exec();
	
	res.json({ok:true});
};

exports.saveAddress = async (req, res) => {
	
	const user = User.findOneAndUpdate({email: req.user.email}, {address: req.body.address}).exec();
	
	res.json({ok: true});
	
};

exports.applyCouponToUserCart = async (req, res) => {
	const {coupon} = req.body;
	
	const validCoupon = await Coupon.findOne({name: coupon}).exec();
	
	if(validCoupon === null){
		res.json({
			err:'Invalid Coupon'
		})
	}
	
	const user = await User.findOne({email: req.user.email}).exec();
	
	let {products, cartTotal} = await Cart.findOne({orderedBy: user._id})
		.populate('products.product', '_id title price')
		.exec();
	
	const totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount)/100).toFixed(2);
	
	await Cart.findOneAndUpdate({orderedBy: user._id}, {totalAfterDiscount: totalAfterDiscount}, {new: true}).exec();
	
	res.json(totalAfterDiscount);
	
};

exports.createOrder = async (req, res) => {
	try{
		const {paymentIntent} = req.body.stripeResponse;
		const user = await User.findOne({email: req.user.email}).exec();
		
		let {products} = await Cart.findOne({orderedBy: user._id}).exec();
		
		let newOrder = await new Order({products, orderedBy: user._id, paymentIntent}).save();
		
		// decrement qty and increment sold
		let bulkOption = products.map((item) => {
			return{
				updateOne:{
					filter:{ _id: item.product._id },
					update: {$inc : {quantity: -item.count, sold: +item.count}}
				}
			}
		})
		
		let updated = await Product.bulkWrite(bulkOption, {});
		
		res.json({ok: true});
	}
	catch (e) {
		console.log(e);
	}
};

exports.getOrders = async (req, res) => {
	const user = await User.findOne({email: req.user.email}).exec();
	
	res.json(await Order.find({orderedBy: user._id})
		.sort('-createdAt')
		.populate("products.product")
		.exec());
};

//wishlist

exports.addToWishlist = async (req, res) => {
	const {productId} = req.body;
	
	const user = await User.findOneAndUpdate(
		{email: req.user.email},
		{ $addToSet: {wishlist: productId}}, {new:true})
		.exec();
	
	res.json({ok: true});
};

exports.wishlist = async (req, res) => {
	const list = await User.find({email:req.user.email})
		.select('wishlist')
		.populate('wishlist')
		.exec();
	
	res.json(list);
};

exports.removeFromWishlist = async (req, res) => {
	const {productId} = req.params;
	
	const user = await User.findOneAndUpdate(
		{email: req.user.email},
		{$pull: { wishlist: productId }})
		.exec();
	
	res.json({ok:true});
};

exports.createCashOrder = async (req, res) => {

	const {couponApplied} = req.body;
	
	const user = await User.findOne({email: req.user.email}).exec();
	
	let userCart = await Cart.findOne({orderedBy: user._id}).exec();
	
	const { cartTotal, totalAfterDiscount} = userCart;
	
	let finalAmount = couponApplied && totalAfterDiscount ? totalAfterDiscount : cartTotal;
	
	let paymentIntent = {
		id: uuidv4(),
		amount: finalAmount*100,
		currency: 'INR',
		status: 'Cash on Delivery',
		created: Date.now(),
		payment_method_types: ['Cash']
	};
	
	
	let newOrder = await new Order({products:userCart.products, orderedBy: user._id, paymentIntent, orderStatus: 'Cash on Delivery'}).save();
	
	// decrement qty and increment sold
	let bulkOption = userCart.products.map((item) => {
		return{
			updateOne:{
				filter:{ _id: item.product._id },
				update: {$inc : {quantity: -item.count, sold: +item.count}}
			}
		}
	})
	
	let updated = await Product.bulkWrite(bulkOption, {});
	
	res.json({ok: true});
	
};