import axios from "axios";

let apiURL;

if(process.env.NODE_ENV === 'production'){
	apiURL = `/api`;
}
else{
	apiURL = process.env.REACT_APP_API;
}



export const userCart = async (cart, authToken) => {
	return await axios.post(`${apiURL}/user/cart`, {cart}, {
		headers: {
			authToken
		}
	});
};

export const getUserCart = async (authToken) => {
	return await axios.get(`${apiURL}/user/cart`,{
		headers: {
			authToken
		}
	});
};

export const emptyCart = async (authToken) => {
	return await axios.delete(`${apiURL}/user/cart`, {
		headers: {
			authToken
		}
	});
};

export const saveUserAddress = async (address, authToken) => {
	return await axios.post(`${apiURL}/user/address`, {address}, {
		headers: {
			authToken
		}
	});
};

export const applyCoupon = async (coupon, authToken) => {
	return await axios.post(`${apiURL}/user/coupon`, {coupon}, {
		headers: {
			authToken
		}
	});
};

export const createOrder = async (stripeResponse, authToken) => {
	return await axios.post(`${apiURL}/user/cart/order`, {stripeResponse}, {
		headers: {
			authToken
		}
	});
};


export const getOrders = async (authToken) => {
	return await axios.get(`${apiURL}/user/orders`,{
		headers: {
			authToken
		}
	});
};

//wishlist

export const getWishlist = async (authToken) => {
	return await axios.get(`${apiURL}/user/wishlist`,{
		headers: {
			authToken
		}
	});
};

export const addToWishlist = async (authToken, productId) => {
	return await axios.post(`${apiURL}/user/wishlist`,{productId}, {
		headers: {
			authToken
		}
	});
};

export const removeWishlist = async (authToken, productId) => {
	return await axios.put(`${apiURL}/user/wishlist/${productId}`,{}, {
		headers: {
			authToken
		}
	});
};

export const createCashOrderForUser = async (authToken, couponApplied) => {
	return await axios.post(`${apiURL}/user/cash-order`, {couponApplied}, {
		headers: {
			authToken
		}
	});
};