import React, {useState} from 'react';
import UserNav from "../../components/nav/UserNav";
import AdminNav from "../../components/nav/AdminNav";
import {auth} from "../../firebase";
import {toast} from "react-toastify";
import {useSelector} from 'react-redux';

const Password = () => {
	
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	
	const {user} = useSelector((state) => ({...state}));
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		await auth.currentUser.updatePassword(password)
			.then(() =>{
				setPassword("");
				setLoading(false);
				toast.success("Password updated");
			})
			.catch(err => {
				setPassword("");
				setLoading(false);
				toast.error(err.message);
			});
		
	}
	
	
	const passwordUpdateFrom = () => {
		
		return(
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label> Your Password </label>
					<input type="password"
					  value={password}
						onChange={e => setPassword(e.target.value)}
						className="form-control"
					  placeholder="Enter new password"
					  disabled={loading}
					/>
					<button className="btn btn-primary"
						disabled={loading || !password || password.length < 6}
					>Submit</button>
				</div>
			</form>
		)
		
	};
	
	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-2">
					{
						user && user.token && user.role === 'subscriber' ? <UserNav /> : <AdminNav />
					}
				</div>
				<div className="col">
					{loading ? <h4 className="text-danger"> Loading... </h4> : <h4> Password Update </h4> }
					{passwordUpdateFrom()}
				</div>
			</div>
		</div>
	);
};

export default Password;