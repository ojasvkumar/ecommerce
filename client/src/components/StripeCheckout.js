import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import {useDispatch, useSelector} from 'react-redux';
import {createPaymentIntent} from "../functions/stripe";
import {Card} from 'antd';
import {LoadingOutlined , CheckOutlined} from '@ant-design/icons';
import card from '../images/card.jpg';
import {useHistory} from 'react-router-dom';
import {createOrder, emptyCart} from '../functions/user';

const StripeCheckout = () => {
	
	const dispatch = useDispatch();
	const {user, coupon} = useSelector(state => ({...state}));
	
	const history = useHistory();
	
	const [succeeded, setSucceeded] = useState(false);
	const [error, setError] = useState(null);
	const [processing, setProcessing] = useState(false);
	const [disabled, setDisabled] = useState(true);
	const [clientSecret, setClientSecret] = useState("");
	
	const [cartTotal, setCartTotal] = useState(0);
	const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
	const [payable, setPayable] = useState(0);
	
	const stripe = useStripe();
	const elements = useElements();
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		setProcessing(true);
		const payload = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: elements.getElement(CardElement),
				billing_details: {
					name: e.target.name.value
				}
			}
		});
		
		if(payload.error){
			setError(`Payment Failed. ${payload.error.message}`);
			setProcessing(false);
		}
		else{
			
			setError(null);
			setProcessing(false);
			setSucceeded(true);
			
			createOrder(payload, user.token)
				.then(res => {
					if(res.data.ok){
						
						if(typeof window!==undefined){
							window.localStorage.removeItem('cart');
						}
						
						dispatch({
							type: 'ADD_TO_CART',
							payload: []
						});
						
						dispatch({
							type: 'COUPON_APPLIED',
							payload: false
						});
						
						emptyCart(user.token);
					}
				})
			
			setTimeout(()=> {
				setSucceeded(false);
				history.push("/user/history");
			}, 2000);
			
		}
		
	}
	
	const handleChange = async (e) => {
		setDisabled(e.empty);
		setError(e.error ? e.error.message : "");
	}
	
	const cartStyle = {
		style: {
			base: {
				color: "#32325d",
				fontFamily: "Arial, sans-serif",
				fontSmoothing: "antialiased",
				fontSize: "16px",
				"::placeholder": {
					color: "#32325d",
				},
			},
			invalid: {
				color: "#fa755a",
				iconColor: "#fa755a",
			},
		},
	};
	
	useEffect(()=> {
		createPaymentIntent(user.token, coupon)
			.then(res => {
				console.log(res.data);
				setClientSecret(res.data.clientSecret);
				setCartTotal(res.data.cartTotal);
				setTotalAfterDiscount(res.data.totalAfterDiscount);
				setPayable(res.data.payable);
			});
	}, []);
	
  return (
    <>
	    {
	    	!succeeded && <div>
			    {coupon && totalAfterDiscount !== undefined ? (
			    	<p className="alert alert-success">{`Total after discount: ₹${totalAfterDiscount}`}</p>
			    ) : (
			    	<p className="alert alert-danger"> No Coupon Applied. </p>
			    )}
		    </div>
	    }
	    
	    
	    <div className="text-center pb-5">
		    <Card style={{border: 'none'}}
		      cover={<img src={card} style={{
		      	height: '200px',
			      objectFit:'scale-down',
			      marginBottom: '-50px',
			      border: 'none'
		      }} />}
          actions={[
            <>
	            <i className="fas fa-rupee-sign" /> <br /> Total: ₹{cartTotal}
            </>,
	          <>
		          <CheckOutlined className="text-info" /> <br /> Total Payable: ₹{payable}
	          </>
          ]}
		    />
	    </div>
	    
	    
      <form id="payment-form" className="stripe-form" onSubmit={handleSubmit}>
	      <CardElement id="card-element" options={cartStyle} onChange={handleChange}/>
	      
	      <button disabled={processing || disabled || succeeded} className="stripe-button">
		      <span id="button-text">
			      {processing ? (<div className="spinner" id="spinner"> </div>) : "Pay"}
		      </span>
	      </button>
	      
	      <br />
	
	      {
		      error && <div className="card-error" role="alert">
			      {error}
		      </div>
	      }
	
	      <p className={succeeded ? 'result-message' : 'result-message hidden'}>
		      Payment Successful. <Link to="/user/history">See it in your Purchase history.</Link>
	      </p>
	      {succeeded && <LoadingOutlined className="text-center h4"/>}
      </form>
    </>
  );
};

export default StripeCheckout;