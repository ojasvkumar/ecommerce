import React, {useState, useEffect} from 'react';
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import {updateCategory, getCategory} from "../../../functions/category";
import CategoryForm from "../../../components/forms/CategoryForm";

const CategoryUpdate = ({history, match}) => {
	
	const {user} = useSelector(state => ({...state}));
	
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	
	const loadCategory = () => {
		getCategory(match.params.slug).then(r => setName(r.data.name))
			.catch(e => console.log(e));
	};
	
	useEffect(()=>{
		loadCategory();
	},[]);
	
	
	
	const handleSubmit = (e) => {
		e.preventDefault();
		//console.log(name);
		setLoading(true);
		
		updateCategory(user.token, match.params.slug,{name})
			.then(res => {
				setLoading(false);
				setName("");
				toast.success(`${res.data.name} is updated`);
				history.push("/admin/category");
			})
			.catch(err => {
				setLoading(false);
				setName("");
				console.log(err);
				toast.error(err);
			});

	};
	
	
	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-2"><AdminNav /></div>
				<div className="col">
					
					{loading ? <h3 className="text-danger">Loading...</h3> : <h3>Update Category</h3>}
					
					<CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} loading={loading}/>
					
					{<br/>}
					
				</div>
			</div>
		</div>
	);
};

export default CategoryUpdate;