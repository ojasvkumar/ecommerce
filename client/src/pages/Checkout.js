import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {getUserCart, emptyCart, saveUserAddress, applyCoupon, createCashOrderForUser} from "../functions/user";
import {toast} from "react-toastify";
import {useHistory} from "react-router-dom";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const Checkout = () => {
	
	const [products, setProducts] = useState([]);
	const [total, setTotal] = useState(0);
	const [address, setAddress] = useState('');
	const [addressSaved, setAddressSaved] = useState(false);
	const [coupon, setCoupon] = useState('');
	const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
	const [discountError, setDiscountError] = useState('');
	
	const history = useHistory();
	
	const dispatch = useDispatch();
	const {user, COD} = useSelector(state => ({...state}));
	const redux = useSelector(state => ({...state}));
	const couponApplied = redux.coupon;
	
	useEffect(()=> {
		getUserCart(user.token)
			.then(res =>{
				setProducts(res.data.products);
				setTotal(res.data.cartTotal);
			})
			.catch(err => console.log(err))
	}, []);
	
	const saveAddressToDB = () => {
		//
		saveUserAddress(address, user.token)
			.then(res => {
				if(res.data.ok){
					setAddressSaved(true);
					toast.success("Address Saved");
				}
			})
			.catch(err => console.log(err));
	};
	
	const handleEmpty = () => {
		if(typeof window !== undefined) {
			localStorage.removeItem('cart');
		}
		dispatch({
			type:"ADD_TO_CART",
			payload: []
		});
		dispatch({
			type:"COUPON_APPLIED",
			payload: false
		});
		
		emptyCart(user.token)
			.then(res =>{
				setProducts([]);
				setTotal(0);
				setTotalAfterDiscount(0);
				setCoupon('');
				!COD ? toast.success('Cart is empty. Continue Shopping.')
					: toast.success('Cash on Delivery Order Placed.');
				
				setTimeout(()=> {
					!COD ? history.push("/shop") : history.push("/user/history");
					
					dispatch({
						type:"COD",
						payload: false
					});
				}, 3000);
				
			})
			.catch(err => console.log(err));
		
	};
	
	const createCashOrder = () => {
		console.log('cash order');
		createCashOrderForUser(user.token, couponApplied)
			.then(res => {
				if(res.data.ok){
					handleEmpty();
				}
			})
	};
	
	
	
	const showAddress = () => {
		return (
			<>
				<h4>Delivery Address</h4>
				<br />
				<br />
				<ReactQuill theme="snow" value={address} onChange={setAddress}/>
				<button className="btn btn-primary mt-2" onClick={saveAddressToDB}>
					Save
				</button>
			</>
		);
	};
	
	const showOrderSummary = () => {
		return (
			<div className="col-md-6">
				<h4>Order Summary</h4>
				<hr />
				<p> {products.length} Product/s</p>
				<hr />
				{
					products.map((p, i) => <div key={p.product._id}>
						<p>{p.product.title} ({p.color}) x {p.count} = {" "}
							₹{p.product.price * p.count}</p>
					</div>)
				}
				<hr />
				<p>Cart Total: {totalAfterDiscount > 0 ? (<span><span style={{textDecoration: 'line-through', textDecorationThickness:'2px'}}>${total}</span> {"  "} ₹{totalAfterDiscount}</span>) : (<span>₹{total}</span>)}</p>
				
				{
					totalAfterDiscount > 0 && (
						<p className="bg-success p-2">Discount Applied: Total Payable ₹{totalAfterDiscount}</p>
					)
				}
				
				<div className="row">
					<div className="col-md-6">
						{
							COD ? (
								<button onClick={createCashOrder} disabled={!addressSaved} className="btn btn-primary">Place Order</button>
							) : (
								<button onClick={() => history.push('/payment')} disabled={!addressSaved} className="btn btn-primary">Place Order</button>
							)
						}
					</div>
					
					<div className="col-md-6">
						<button disabled={!products.length} className="btn btn-primary" onClick={handleEmpty}>Empty Cart</button>
					</div>
				
				</div>
			
			</div>
		);
	};
	
	const applyDiscountCoupon = (e) => {
		applyCoupon(coupon, user.token)
			.then(res => {
				//console.log(res.data);
				if(res.data){
					setTotalAfterDiscount(res.data);
					//push to redux store
					dispatch({
						type:'COUPON_APPLIED',
						payload:'true'
					});
					
				}
				//error
				if(res.data.err){
					setDiscountError(res.data.err);
					dispatch({
						type:'COUPON_APPLIED',
						payload:'false'
					});
				}
			})
	};
	
	const showApplyCoupon = () => {
		return(
			<>
				<input
					type="text"
					className="form-control"
					value={coupon}
					onChange={e => {
						setCoupon(e.target.value);
						setDiscountError('');
					}}
				/>
				<button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">Apply</button>
			</>
		)
	};
	
  return (
    <div className="row">
      <div className="col-md-6">
	      
	      {showAddress()}
	      <hr />
	      <h4>Got Coupons?</h4>
	      <br />
	      
	      {showApplyCoupon()}
	      
	      {discountError && <p className="bg-danger p-2">{discountError}</p>}
	      
      </div>
	    {showOrderSummary()}
    </div>
  );
};

export default Checkout;