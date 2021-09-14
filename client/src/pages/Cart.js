import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from "react-redux";
import {Link} from 'react-router-dom';
import ProductCardInCheckout from '../components/cards/ProductCardInCheckout';
import {userCart} from "../functions/user";

const Cart = ({history}) => {
	
	const {user, cart} = useSelector(state => ({...state}));
	const dispatch = useDispatch();
	
	
	const getTotal = () => {
		return cart.reduce((current, next) => {
			return current + next.count * next.price;
		}, 0);
	};
	
	const saveOrderToDB = () =>{
		
		userCart(cart, user.token)
			.then(res => {
				//console.log("Cart post res", res);
				if(res.data.ok){
					history.push("/checkout");
				}
			})
			.catch(err => {
				console.error("user cart front-end err", err);
			})
	};
	
	const saveCashOrderToDB = () => {
		
		dispatch({
			type:'COD',
			payload: true
		});
		
		userCart(cart, user.token)
			.then(res => {
				//console.log("Cart post res", res);
				if(res.data.ok){
					history.push("/checkout");
				}
			})
			.catch(err => {
				console.error("user cart front-end err", err);
			});
		
	};
	
	const showCartItems = () =>{
		return (
			<table className="table table-bordered">
				<thead className="thead-light">
					<tr>
						<th scope="col">Image</th>
						<th scope="col">Title</th>
						<th scope="col">Price</th>
						<th scope="col">Brand</th>
						<th scope="col">Color</th>
						<th scope="col">Count</th>
						<th scope="col">Shipping</th>
						<th scope="col">Remove</th>
					</tr>
				</thead>
				{
					cart.map(p => (
						<ProductCardInCheckout product={p} />
					))
				}
			</table>
		);
	};
	
  return (
    <div className="container-fluid pt-2">
      <div className="row">
		    <div className="col-md-8">
			    <h4>
				    Cart
			    </h4>
			    {!cart.length ?
				    <p>
					    No Products in Cart. <Link to="/shop">Continue Shopping</Link>
			      </p> : (
			        showCartItems()
				    )}
		    </div>
		    <div className="col-md-4">
			    <h4>Order Summary</h4>
			    <hr />
			    <p>Products</p>
			    {cart.map((c, i) => <div key={i}>
				    <p>{c.title} x {c.count} = ₹{c.price * c.count}</p>
			    </div>)}
			    <hr />
			    
			    Total: <b>₹{getTotal()}</b>
			    
			    <hr />
			    
			    {
			      user ? (
			        <>
				        <button onClick={saveOrderToDB} disabled={!cart.length} className="btn btn-sm btn-primary mt-2">Proceed to Checkout</button>
				        <br />
				        <button onClick={saveCashOrderToDB} disabled={!cart.length} className="btn btn-sm btn-warning mt-2">Pay Cash on Delivery</button>
			        </>
				    ) : (
				      <Link to={{
				      	pathname: '/login',
					      state: {from: 'cart'}
				      }}>
					      <button className="btn btn-sm btn-primary mt-2">Login to Checkout</button>
				      </Link>
				    )
			    }
			    
		    </div>
      </div>
    </div>
  );
};

export default Cart;