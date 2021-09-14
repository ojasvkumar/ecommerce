import React, {useState, useEffect} from 'react';
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import {updateSub, getSub} from "../../../functions/sub";
import CategoryForm from "../../../components/forms/CategoryForm";
import {getCategories} from "../../../functions/category";

const SubUpdate = ({history, match}) => {
	
	const {user} = useSelector(state => ({...state}));
	
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [categories, setCategories] = useState({});
	const [parent, setParent] = useState("");
	
	useEffect(()=>{
		loadSub();
		loadCategories();
	},[]);
	
	const loadCategories = () => getCategories().then(r => setCategories(r.data))
		.catch(e => console.log(e));
	
	const loadSub = () => getSub(match.params.slug).then(r => {
		setName(r.data.name);
		setParent(r.data.parent);
		console.log(parent);
		})
		.catch(e => console.log(e));
	
	const handleSubmit = (e) => {
		e.preventDefault();
		//console.log(name);
		setLoading(true);
		
		updateSub(user.token, match.params.slug,{name, parent})
			.then(res => {
				setLoading(false);
				setName("");
				toast.success(`${res.data.name} is updated`);
				history.push("/admin/sub");
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
					
					{loading ? <h3 className="text-danger">Loading...</h3> : <h3>Update Sub Category</h3>}
					
					<div className="form-group">
						<label>Parent Category</label>
						<select className="form-control" onChange={(e) => setParent(e.target.value)}>
							<option value="Please Select">Please select</option>
							{
								categories[0] && categories.map(c => {
									return(
										<option key={c._id} value={c._id} selected={c._id === parent}>
											{c.name}
										</option>
									);
								})
							}
						</select>
					</div>
					
					<CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} loading={loading}/>
					
					{<br/>}
				
				</div>
			</div>
		</div>
	);
};

export default SubUpdate;