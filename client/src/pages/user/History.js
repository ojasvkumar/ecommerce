import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import UserNav from "../../components/nav/UserNav";
import {getOrders} from "../../functions/user";
import {useSelector, useDispatch} from 'react-redux';
import {CheckCircleOutlined, CloseCircleOutlined} from '@ant-design/icons';
import {toast} from 'react-toastify';
import ShowPaymentInfo from "../../components/cards/ShowPaymentInfo.js";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


export const showOrderInTable = (order) => (
	<table className="table table-bordered">
		<thead className="thead-light">
		<tr>
			<th scope="col">Title</th>
			<th scope="col">Price</th>
			<th scope="col">Brand</th>
			<th scope="col">Color</th>
			<th scope="col">Count</th>
			<th scope="col">Shipping</th>
		</tr>
		</thead>
		
		<tbody>
		{
			order.products.map((p, i) => (
				<tr key={p._id}>
					<td style={{cursor: 'pointer'}}><b><Link to={`/product/${p.product.slug}`} style={{color: '#aaf'}} >{p.product.title}</Link></b></td>
					<td>{p.product.price}</td>
					<td>{p.product.brand}</td>
					<td>{p.product.color}</td>
					<td>{p.count}</td>
					<td>{p.product.shipping === "Yes" ?
						(<CheckCircleOutlined className="h4" style={{color:'green'}}/>) :
						(<CloseCircleOutlined className="h4" style={{color:'red'}}/>)}</td>
				</tr>
			))
		}
		</tbody>
	</table>
);


const History = () => {
	
	const [orders, setOrders] = useState([]);
	
	const {user} = useSelector(state => ({...state}));
	
	useEffect(()=>{
		loadAllOrders();
	}, []);
	
	const loadAllOrders = () =>{
		getOrders(user.token)
			.then(res => {
				//console.log(JSON.stringify(res.data, null, 4));
				setOrders(res.data);
			});
	}
	
	// const discount =
	
	const showEachOrder = () => {
		return orders.map((order, i) => (
			<div key={order._id} className={`mb-5 p-3 card text-center`} >
				<ShowPaymentInfo order={order} />
				{showOrderInTable(order)}
				<div className="row">
					<div className="col">
						{showDownloadLink(order)}
					</div>
				</div>
			</div>
		))
	};
	
	const handleClick = (order) => {
		
		let body = [];
		const head = [{text:['Title'], style:'header'},{text:['Price'], style:'header'},{text:['Brand'], style:'header'},{text:['Color'], style:'header'},{text:['Quantity'], style:'header'},{text:['Shipping'], style:'header'}];
		
		
		
		body = order.products.map((p) => {
			const arr= [];
			arr.push(p.product.title);
			arr.push(`₹${p.product.price}`);
			arr.push(p.product.brand);
			arr.push(p.product.color);
			arr.push(p.count);
			arr.push(p.product.shipping);
			return arr;
		});
		
		body = [head, ...body];
		
		console.log(body);
		
		let size = Object.keys(order.paymentIntent).length;
		const date = size === 6  ? order.paymentIntent.created : order.paymentIntent.created * 1000;
		
		var dd = {
			content: [
				{text: `~ ${new Date().toLocaleString()} ~`, style: 'invoiceHeader'},
				{text: 'Order Invoice', style: 'title'},
				{text: 'Business Name', style: 'author'},
				{text: 'Order Summary:', style: 'subtitle'},
				{
					style: 'table1',
					table: {
						widths: ['*','*','*','*','*','*'],
						body:[...body]
					}
				},
				{text: `Date:                   ${new Date(date).toLocaleString()}`, style: 'text'},
				{text: `Order ID:             ${order.paymentIntent.id}`, style: 'text'},
				{text: `Order Status:     ${order.orderStatus}`, style: 'text'},
				{text: `Total Paid:          ${order.paymentIntent.amount}`, style: 'text'},
				{text: `~ Thank you for shopping with us. ~`, style: 'footer'},
			],
			styles: {
				invoiceHeader: {
					fontSize: 13,
					color:'gray',
					alignment: 'center',
					margin: [0, 0, 0, 10],
				},
				header: {
					fontSize: 15,
					bold: true,
					margin: [0, 0, 0, 10],
					color:'gray',
					alignment: 'center'
				},
				subtitle: {
					fontSize: 13,
					bold: true,
					margin: [0, 10, 0, 5]
				},
				title:{
					fontSize: 24,
					alignment: "center",
					margin:[0,0,0,15]
				},
				author:{
					fontSize: 16,
					alignment: "center",
					color: "#0275d8",
					margin:[0,0,0,40]
				},
				footer: {
					fontSize: 10,
					margin: [0,100,0,20],
					alignment: "center",
					color: "gray",
				},
				text: {
					margin: [5,5,5,5],
					fontSize: 12,
					alignment: "justify",
					color:'#696969'
				},
			}
		}
		
		pdfMake.createPdf(dd).download(`${order._id}_invoice.pdf`);
		
	};
	
	const showDownloadLink = (order) => {
		return(
			<button onClick={() => handleClick(order)} className="btn btn-sm btn-block btn-outline-primary text-primary">
				Download Invoice (PDF)
			</button>
		);
	};
	
  return (
  	<div className="container-fluid">
		  <div className="row">
			  <div className="col-md-2"><UserNav /></div>
			  <div className="col">
			    <h4 className="text-center">
				    {orders.length > 0 ? "User Purchase History" : "No Purchase History"}
			    </h4>
				  
				  {showEachOrder()}
				  
			  </div>
		  </div>
	  </div>
  );
};

export default History;