import axios from "axios";

let apiURL;

if(process.env.NODE_ENV === 'production'){
	apiURL = `/api`;
}
else{
	apiURL = process.env.REACT_APP_API;
}


export const getOrders = (authToken) => {
	return axios.get(`${apiURL}/admin/orders`, {
		headers: {
			authToken
		}
	});
};

export const changeStatus  = (authToken, orderId, orderStatus) => {
	return axios.put(`${apiURL}/admin/order-status`, {orderId, orderStatus}, {
		headers: {
			authToken
		}
	})
};