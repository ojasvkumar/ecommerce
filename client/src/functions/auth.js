import axios from "axios";

let apiURL;
if(process.env.NODE_ENV === 'production'){
	apiURL = `/api`;
}
else{
	apiURL = process.env.REACT_APP_API;
}


export const createOrUpdateUser = async (authToken) => {
	
	let axiosConfig = {
		headers: {
			authToken
		}
	};
	const url = `${apiURL}/create-or-update-user`;
	return await axios.post(url,{}, axiosConfig);
	
};

export const currentUser = async (authToken) => {
	
	let axiosConfig = {
		headers: {
			authToken
		}
	};
	const url = `${apiURL}/current-user`;
	return await axios.post(url,{}, axiosConfig);
	
};

export const currentAdmin = async (authToken) => {
	
	let axiosConfig = {
		headers: {
			authToken
		}
	};
	const url = `${apiURL}/current-admin`;
	return await axios.post(url,{}, axiosConfig);
	
};