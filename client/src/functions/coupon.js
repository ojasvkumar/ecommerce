import axios from "axios";

let apiURL;

if(process.env.NODE_ENV === 'production'){
	apiURL = `/api`;
}
else{
	apiURL = process.env.REACT_APP_API;
}

export const getCoupons = async (authToken) => {
	const url = `${apiURL}/coupons`;
	return await axios.get(url, {
		headers: {
			authToken
		}
	});
};

export const createCoupon = async (authToken, coupon) => {
	
	let axiosConfig = {
		headers: {
			authToken
		}
	};
	const url = `${apiURL}/coupon`;
	return await axios.post(url, {coupon}, axiosConfig);
	
};

export const removeCoupon = async (authToken, couponId) => {
	
	let axiosConfig = {
		headers: {
			authToken
		}
	};
	const url = `${apiURL}/coupon/${couponId}`;
	return await axios.delete(url, axiosConfig);
	
};