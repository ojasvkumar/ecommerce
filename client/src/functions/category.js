import axios from "axios";

let apiURL;

if(process.env.NODE_ENV === 'production'){
	apiURL = `/api`;
}
else{
	apiURL = process.env.REACT_APP_API;
}

export const getCategories = async () => {
	const url = `${apiURL}/categories`;
	return await axios.get(url);
};

export const getCategory = async (slug) => {
	const url = `${apiURL}/category/${slug}`;
	return await axios.get(url);
};

export const createCategory = async (authToken, category) => {
	
	let axiosConfig = {
		headers: {
			authToken
		}
	};
	const url = `${apiURL}/category`;
	return await axios.post(url, category, axiosConfig);
	
};

export const removeCategory = async (authToken, slug) => {
	
	let axiosConfig = {
		headers: {
			authToken
		}
	};
	const url = `${apiURL}/category/${slug}`;
	return await axios.delete(url, axiosConfig);
	
};

export const updateCategory = async (authToken, slug, category) => {
	
	let axiosConfig = {
		headers: {
			authToken
		}
	};
	const url = `${apiURL}/category/${slug}`;
	return await axios.put(url,category, axiosConfig);
};

export const getSubs = async (_id) => {
	const url = `${apiURL}/category/subs/${_id}`;
	return await axios.get(url);
};