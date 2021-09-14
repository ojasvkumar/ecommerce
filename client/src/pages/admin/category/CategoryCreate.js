import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import {createCategory, getCategories, removeCategory} from "../../../functions/category";
import {EditOutlined, DeleteOutlined} from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";

const CategoryCreate = () => {
	
	const {user} = useSelector(state => ({...state}));
	
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [keyword, setKeyword] = useState("");
	
	const [categories, setCategories] = useState({});
	
	useEffect(()=>{
		loadCategories();
	},[]);
	
	const loadCategories = () => getCategories().then(r => setCategories(r.data))
		.catch(e => console.log(e));
	
	const search = (keyword) => (c) => c.name.toLowerCase().includes(keyword);
	
	const handleSubmit = (e) => {
		e.preventDefault();
		//console.log(name);
		setLoading(true);
		
		createCategory(user.token, {name})
			.then(res => {
				setLoading(false);
				setName("");
				toast.success(`${res.data.name} is created`);
				loadCategories();
			})
			.catch(err => {
				setLoading(false);
				setName("");
				toast.error(err.response.data);
			});
		
	};
	
	const handleRemove = (slug) => {
		if(window.confirm('Are you sure you want to Delete this Category?')) {
			setLoading(true);
			removeCategory(user.token, slug)
				.then(res => {
					setLoading(false);
					toast.error(`${res.data.name} deleted successfully`);
					loadCategories();
				})
				.catch(err => console.log(err));
		}
	};

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-2"><AdminNav /></div>
				<div className="col">
				
					{loading ? <h3 className="text-danger">Loading...</h3> : <h3>Create Category</h3>}
					
					<CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} loading={loading}/>
					
					{<hr />}
					
					<LocalSearch setKeyword={setKeyword} keyword={keyword}  />
					
					{
						categories[0] && categories.filter(search(keyword.toLowerCase())).map(c=>{
							return(
								<div key={c._id} className="alert alert-secondary">
									{c.name}{"  "}
									<span className="btn btn-sm float-right" onClick={()=> handleRemove(c.slug)}>
										<DeleteOutlined className="text-danger"/>
									</span>
									<span className="btn btn-sm float-right">
										<Link to={`/admin/category/${c.slug}`} ><EditOutlined className="text-warning" /></Link>
									</span>
								</div>
							)
						})
					}
				</div>
			</div>
		</div>
	);
};

export default CategoryCreate;