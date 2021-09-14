import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import AdminNav from "../../../components/nav/AdminNav";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";
import {createSub, getSubs, removeSub} from "../../../functions/sub";
import {getCategories} from "../../../functions/category";
import {EditOutlined, DeleteOutlined} from "@ant-design/icons";
import CategoryForm from "../../../components/forms/CategoryForm";
import LocalSearch from "../../../components/forms/LocalSearch";

const SubCreate = () => {
	
	const {user} = useSelector(state => ({...state}));
	
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [keyword, setKeyword] = useState("");
	const [category, setCategory] = useState("");
	const [categories, setCategories] = useState({});
	const [subs, setSubs] = useState([]);
	
	useEffect(()=>{
		loadSubs();
		loadCategories();
	},[]);
	
	const loadCategories = () => getCategories().then(r => setCategories(r.data))
		.catch(e => console.log(e));
	
	const loadSubs = () => getSubs().then(s => setSubs(s.data))
		.catch(e => console.log(e));
	
	const search = (keyword) => (c) => c.name.toLowerCase().includes(keyword);
	
	const handleSubmit = (e) => {
		e.preventDefault();
		//console.log(name);
		setLoading(true);
		
		createSub(user.token, {name, parent: category})
			.then(res => {
				setLoading(false);
				setName("");
				toast.success(`${res.data.name} is created`);
				loadSubs();
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
			removeSub(user.token, slug)
				.then(res => {
					setLoading(false);
					toast.error(`${res.data.name} deleted successfully`);
					loadSubs();
				})
				.catch(err => console.log(err));
		}
	};
	
	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-2"><AdminNav /></div>
				<div className="col">
					
					{loading ? <h3 className="text-danger">Loading...</h3> : <h3>Create Sub Category</h3>}
					
					
					
					<div className="form-group">
						<label>Parent Category</label>
						<select className="form-control" onChange={(e) => setCategory(e.target.value)}>
							<option value="Please Select">Please select</option>
							{
								categories[0] && categories.map(c => {
									return(
										<option key={c._id} value={c._id}>
											{c.name}
										</option>
									);
								})
							}
						</select>
					</div>
					
					
					<CategoryForm handleSubmit={handleSubmit} name={name} setName={setName} loading={loading}/>
					
					{<hr />}
					
					<LocalSearch setKeyword={setKeyword} keyword={keyword}  />
					
					{
						subs[0] && subs.filter(search(keyword.toLowerCase())).map(c=>{
							return(
								<div key={c._id} className="alert alert-secondary">
									{c.name}
									<span className="btn btn-sm float-right" onClick={()=> handleRemove(c.slug)}>
										<DeleteOutlined className="text-danger"/>
									</span>
									<span className="btn btn-sm float-right">
										<Link to={`/admin/sub/${c.slug}`} ><EditOutlined className="text-warning" /></Link>
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

export default SubCreate;