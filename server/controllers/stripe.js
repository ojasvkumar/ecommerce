const User = require('../models/user');
const Cart = require('../models/cart');
const Product = require('../models/product');
const Coupon = require('../models/coupon');

const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.createPaymentIntent = async (req, res) => {
	
	const user = await User.findOne({email: req.user.email}).exec();
	
	const cart = await Cart.findOne({orderedBy: user._id}).exec();
	
	const {cartTotal, totalAfterDiscount} = cart;
	
	const {couponApplied} = req.body;
	
	let finalAmount = couponApplied && totalAfterDiscount ? totalAfterDiscount : cartTotal;
	
	const paymentIntent = await stripe.paymentIntents.create({
		amount: finalAmount * 100, // in paise
		currency: 'inr'
	});
	
	res.send({
		clientSecret: paymentIntent.client_secret,
		cartTotal,
		totalAfterDiscount,
		payable: finalAmount
	});
	
};