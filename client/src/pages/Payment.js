import React from 'react';
import { loadStripe } from "@stripe/stripe-js";
import {Elements} from '@stripe/react-stripe-js';
import StripeCheckout from "../components/StripeCheckout";
import '../stripe.css';

//load stripe outside of components to avoid recreating stripe object after every rendering
const promise = loadStripe(process.env.REACT_APP_STRIPE_KEY);


const Payment = () => {
  return (
    <div className="container text-center p-5">
	    <h4>Complete your Purchase</h4>
      <Elements stripe={promise}>
	      <div className="col-md-8 offset-md-2">
		      <StripeCheckout />
	      </div>
      </Elements>
    </div>
  );
};

export default Payment;