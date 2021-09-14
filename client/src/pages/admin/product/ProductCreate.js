import React, {useState, useEffect} from 'react';
import AdminNav from "../../../components/nav/AdminNav";
import {createProduct} from "../../../functions/product"
import {useSelector} from "react-redux";
import {toast} from "react-toastify"
import ProductCreateForm from "../../../components/forms/ProductCreateForm";
import { getCategories, getSubs } from "../../../functions/category";
import FileUpload from "../../../components/forms/FileUpload";
import {LoadingOutlined} from "@ant-design/icons";

const initialState = {
	title:'',
	description:'',
	price:'',
	category:'',
	categories:[],
	subs:[],
	shipping:'',
	quantity:'',
	images:[],
	colors:["Black", "White", "Silver", "Blue", "Brown"],
	brands:["Apple","Dell", "Samsung", "Microsoft", "Asus", "HP"],
	color:'',
	brand:'',
}

const ProductCreate = ({history}) => {
	
	const [values, setValues] = useState(initialState);
	const [subOptions, setSubOptions] = useState([]);
	const [showSubs, setShowSubs] = useState(false);
	const [loading, setLoading] = useState(false);
	const {user} = useSelector(state => ({...state}));
	
	useEffect(()=>{
		loadCategories();
	},[showSubs]);
	
	const loadCategories = () => {
		getCategories()
			.then(r => setValues({...values, categories: r.data}))
			.catch(e => console.log(e));
	}
	
	const handleSubmit = (e) => {
		e.preventDefault();
		
		createProduct(values, user.token)
			.then(res => {
				console.log("response product", res);
				window.alert(`${res.data.title} is created`);
				window.location.reload();
				history.push("/admin/products")
			})
			.catch(e => {
				console.log(e);
				toast.error(e.response.data.err);
			});
		
	};
	
	const handleChange = (e) => {
		setValues({...values, [e.target.name]: e.target.value});
	};
	
	const handleCategoryChange = (e) => {
		e.preventDefault();
		if(e.target.value === 'Please Select'){
			setShowSubs(false);
		}
		
		console.log("CLICKED CATEGORY", e.target.value);
		setValues({...values, subs:[], category: e.target.value});
		
		getSubs(e.target.value)
			.then(res => {
				console.log("SUB OPTIONS", res.data);
				setSubOptions(res.data);
			})
		setShowSubs(true);
	};
	
	return(
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-2"><AdminNav /></div>
				<div className="col-md-10">
					{ loading ? <LoadingOutlined className="text-danger h1"/> :<h4>Product Create</h4>}
					<hr />
					
					<div className="p-3">
						<FileUpload values={values} setValues={setValues} setLoading={setLoading}/>
					</div>
					
					<ProductCreateForm
						handleChange={handleChange}
						handleSubmit={handleSubmit}
						values={values}
						setValues={setValues}
						handleCategoryChange={handleCategoryChange}
						showSubs={showSubs}
						subOptions={subOptions}
					/>
				</div>
			</div>
		</div>
	);
	
};

export default ProductCreate;