import axios from "axios";

let apiURL;

if(process.env.NODE_ENV === 'production'){
	apiURL = `/api`;
}
else{
	apiURL = process.env.REACT_APP_API;
}

export const createProduct = async (product, authToken) => {
	return await axios.post(`${apiURL}/product`, product, {
		headers:{
			authToken
		}
	})
};

export const getProductsByCount = async (count) => {
	return await axios.get(`${apiURL}/products/${count}`);
};

export const removeProduct = async (slug, authToken) => {
	return await axios.delete(`${apiURL}/product/${slug}`, {
		headers:{
			authToken
		}
	})
};

export const getProduct = async (slug) => {
	return await axios.get(`${apiURL}/product/${slug}`);
};

export const updateProduct = async (slug, product, authToken) => {
	return await axios.put(`${apiURL}/product/${slug}`, product, {
		headers:{
			authToken
		}
	})
};

export const getProducts = async (sort, order, page) => {
	return await axios.post(`${apiURL}/products`, {sort, order, page});
};

export const getProductsCount = async () => {
	return await axios.get(`${apiURL}/products/total`);
};

export const productStar = async (productId, star, authToken) => {
	return await axios.put(`${apiURL}/product/star/${productId}`, {star}, {
		headers:{
			authToken
		}
	});
};

export const getRelated = async (productId) => {
	return await axios.get(`${apiURL}/product/related/${productId}`);
};

export const fetchProductsByFilter = async (arg) => {
	return await axios.post(`${apiURL}/search/filters/`, arg);
};