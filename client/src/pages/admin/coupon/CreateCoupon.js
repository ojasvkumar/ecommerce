import React, {useState, useEffect} from 'react';
import {useSelector} from "react-redux";
import {toast} from 'react-toastify';
import DatePicker from "react-datepicker";
import {getCoupons, createCoupon, removeCoupon} from '../../../functions/coupon';
import {DeleteOutlined} from '@ant-design/icons';
import AdminNav from "../../../components/nav/AdminNav";
import 'react-datepicker/dist/react-datepicker.css';


const CreateCoupon = () => {
	
	const [name, setName] = useState('');
	const [expiry, setExpiry] = useState('');
	const [discount, setDiscount] = useState('');
	const [loading, setLoading] = useState(false);
	const [coupons, setCoupons] = useState([]);
	
	const {user} = useSelector((state) => ({...state}));
	
	useEffect(()=> {
		loadAllCoupons();
	}, []);
	
	const loadAllCoupons = () => {
		getCoupons(user.token)
			.then(res => {
				setCoupons(res.data);
			});
	}
	
	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		
		createCoupon(user.token, {name, expiry, discount})
			.then(res => {
				setLoading(false);
				setExpiry('');
				setDiscount('');
				setName('');
				toast.success(`${res.data.name} Coupon Created.`)
				loadAllCoupons();
			})
			.catch(err => console.log(err));
		
	}
	
	const handleRemove = (couponId) => {
		if(window.confirm('Are you sure you want to remove this coupon?')){
			setLoading(true);
			removeCoupon(user.token, couponId)
				.then(res => {
					loadAllCoupons();
					setLoading(false);
					toast.error(`Coupon "${res.data.name}" is deleted.`);
				})
				.catch(err => console.log(err));
		}
	};
	
	const displayCoupons = () => {
		return(
			<table className="table table-bordered">
				<thead className="thead-light">
					<tr>
						<th scope="col">Name</th>
						<th scope="col">Expiry</th>
						<th scope="col">Discount</th>
						<th scope="col">Delete Coupon</th>
					</tr>
				</thead>
				<tbody>
				{
					coupons.map((c) => <tr key={c._id}>
						<td scope="col">{c.name}</td>
						<td scope="col">{new Date(c.expiry).toLocaleDateString()}</td>
						<td scope="col">{c.discount}</td>
						<td scope="col" className="text-center">
							<DeleteOutlined onClick={() => handleRemove(c._id)} className="text-danger h5 pointer"/>
						</td>
					</tr>)
				}
				</tbody>
			</table>
		);
	}
	
  return (
    <div className="container-fluid">
      <div className="row">
	      <div className="col-md-2">
		      <AdminNav />
	      </div>
	      <div className="col-md-10 mt-2">
		      <h4>{loading ? "Loading" : "Coupons"}</h4>
		
		      <form onSubmit={handleSubmit}>
			      
			      <div className="form-group">
				      <label className="text-muted" >Name</label>
				      <input
					      type="text"
					      className="form-control"
					      value={name.toUpperCase()}
					      onChange={(e) => setName(e.target.value)}
				        required
					      autoFocus
				      />
			      </div>
			      
						<div className="form-group">
				      <label className="text-muted" >Discount %</label>
				      <input
					      type="text"
					      className="form-control"
					      value={discount}
					      onChange={(e) => setDiscount(e.target.value)}
					      required
				      />
		        </div>
				      
						<div className="form-group">
				      <label className="text-muted" >Expiry</label>
							<br />
				      <DatePicker
					      className="form-control"
				        selected={new Date()}
					      value={expiry}
					      onChange={(date) => setExpiry(date)}
					      required
				      />
	          </div>
			      
			      <button disabled={name.length < 6} className="btn btn-outline-primary mt-3">Save</button>
		      </form>
		      
		      <hr />
		      
		      {displayCoupons()}
		      
	      </div>
      </div>
    </div>
  );
};

export default CreateCoupon;