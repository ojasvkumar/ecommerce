import axios from "axios";

let apiURL;

if(process.env.NODE_ENV === 'production'){
	apiURL = `/api`;
}
else{
	apiURL = process.env.REACT_APP_API;
}


export const getSubs = async () => {
	const url = `${apiURL}/subs`;
	return await axios.get(url);
};


export const getSub = async (slug) => {
	const url = `${apiURL}/sub/${slug}`;
	return await axios.get(url);
};

export const createSub = async (authToken, sub) => {
	
	let axiosConfig = {
		headers: {
			authToken
		}
	};
	const url = `${apiURL}/sub`;
	return await axios.post(url, sub, axiosConfig);
	
};

export const removeSub = async (authToken, slug) => {
	
	let axiosConfig = {
		headers: {
			authToken
		}
	};
	const url = `${apiURL}/sub/${slug}`;
	return await axios.delete(url, axiosConfig);
	
};

export const updateSub = async (authToken, slug, sub) => {
	
	let axiosConfig = {
		headers: {
			authToken
		}
	};
	const url = `${apiURL}/sub/${slug}`;
	return await axios.put(url,sub, axiosConfig);
};