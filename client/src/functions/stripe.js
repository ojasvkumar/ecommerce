import axios from "axios";

let apiURL;

if(process.env.NODE_ENV === 'production'){
	apiURL = `/api`;
}
else{
	apiURL = process.env.REACT_APP_API;
}


export const createPaymentIntent = (authToken, coupon) => {
	return axios.post(`${apiURL}/create-payment-intent`, {couponApplied: coupon}, {
		headers: {
			authToken
		}
	})
}