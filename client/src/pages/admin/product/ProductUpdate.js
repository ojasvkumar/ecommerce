import React, {useState, useEffect} from 'react';
import AdminNav from "../../../components/nav/AdminNav";
import {useSelector} from "react-redux";
import {getProduct, updateProduct} from "../../../functions/product";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";
import { getCategories, getSubs } from "../../../functions/category";
import FileUpload from "../../../components/forms/FileUpload";
import {LoadingOutlined} from "@ant-design/icons";
import {toast} from "react-toastify";

const initialState = {
	title:'',
	description:'',
	price:'',
	category:'',
	subs:[],
	shipping:'',
	quantity:'',
	images:[],
	colors:["Black", "White", "Silver", "Blue", "Brown"],
	brands:["Apple","Dell", "Samsung", "Microsoft", "Asus", "HP"],
	color:'',
	brand:'',
};

const ProductUpdate = ({match, history}) => {
	
	const {user} = useSelector(state => ({...state}));
	const {slug} = match.params;
	const [values, setValues] = useState(initialState);
//	const [showSubs, setShowSubs] = useState(false);
	const [subOptions, setSubOptions] = useState([]);
	const [categories, setCategories] = useState([]);
	const [arrayOfSubIds , setArrayOfSubIds] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [loading, setLoading] = useState(false);
	
	
	useEffect(()=>{
		loadProduct();
		loadCategories();
	}, []);
	
	const loadProduct = () => {
		getProduct(slug)
			.then(product => {
				//console.log(product.data.category);
				setValues({...values, ...product.data});
				
				getSubs(product.data.category._id)
					.then(sub=> {
						setSubOptions(sub.data);
						//console.log(sub.data);
					});
				let arr = [];
				
				product.data.subs.map(sub => {
					return arr.push(sub._id);
				});
				setArrayOfSubIds(prev => arr);
			})
			.catch(err => console.log(err));
	};
	
	const loadCategories = () => {
		
		getCategories()
			.then(r => setCategories(r.data))
			.catch(e => console.log(e));
		
	}
	
	const handleChange = (e) => {
		setValues({...values, [e.target.name]: e.target.value});
	};
	
	const handleCategoryChange = (e) => {
		e.preventDefault();
		console.log("CLICKED CATEGORY", e.target.value);
		setValues({...values, subs:[]});
		
		setSelectedCategory(e.target.value);
		
		getSubs(e.target.value)
			.then(res => {
				console.log("SUB OPTIONS", res.data);
				setSubOptions(res.data);
			})
			.catch(err => console.log(err));
		
		if(values.category._id === e.target.value){
			loadProduct();
		}
			
		setArrayOfSubIds([]);
	};
	
	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		
		values.subs = arrayOfSubIds;
		values.category = selectedCategory ? selectedCategory : values.category;
		
		updateProduct(slug, values, user.token)
			.then(res => {
				setLoading(false);
				//console.log(res);
				toast.success(`${res.data.title} is updated`);
				history.push("/admin/products");
			})
			.catch((err) => {
				console.log(err);
				toast.error(err.response.data.err);
			});
		
	};
	
	return(
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-2"><AdminNav /></div>
				<div className="col-md-10">
					{ loading ? <LoadingOutlined className="text-danger h1"/> :<h4>Product Update </h4>}
					{/*{JSON.stringify(values)}*/}
					
					<div className="p-3">
						<FileUpload values={values} setValues={setValues} setLoading={setLoading}/>
					</div>
					<br />
					
					<ProductUpdateForm
						handleSubmit={handleSubmit}
						handleChange={handleChange}
						setValues={setValues}
						values={values}
						handleCategoryChange={handleCategoryChange}
						categories={categories}
						subOptions={subOptions}
						arrayOfSubIds={arrayOfSubIds}
						setArrayOfSubIds={setArrayOfSubIds}
						selectedCategory={selectedCategory}
					/>
				</div>
			</div>
		</div>
	);
	
};

export default ProductUpdate;