import React, {useState, useEffect} from 'react';
import AdminNav from "../../components/nav/AdminNav";
import {getOrders, changeStatus} from "../../functions/admin";
import {useSelector, useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import Orders from "../../components/order/Orders.js"


const AdminDashboard = () => {
	
	const [orders, setOrders] = useState([]);
	
	const {user} = useSelector((state) => ({...state}));
	
	useEffect(()=> {
		loadAllOrders();
	}, []);
	
	const loadAllOrders = () => {
		getOrders(user.token)
			.then(res => {
				setOrders(res.data);
			})
	};
	
	const handleStatusChange = (orderId, orderStatus) => {
		changeStatus(user.token, orderId, orderStatus)
			.then(res => {
				toast.success(`Order Status updated to "${res.data.orderStatus}"`);
				loadAllOrders();
			})
	};
	
  return (
	  <div className="container-fluid">
		  <div className="row">
			  <div className="col-md-2"><AdminNav /></div>
			  <div className="col-md-10">
				  <h4 className="mt-2 mb-5">Admin Dashboard</h4>
				  <Orders orders={orders} handleStatusChange={handleStatusChange}/>
			  </div>
		  </div>
	  </div>
  );
};

export default AdminDashboard;