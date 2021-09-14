import React from 'react';

const ShowPaymentInfo = ({order}) => {
	let size = Object.keys(order.paymentIntent).length;
	const date = size === 6  ? order.paymentIntent.created : order.paymentIntent.created * 1000;
  return (
    <div className="pb-3">
      <div>
	      <span><b>Order ID:</b> {order.paymentIntent.id}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	      <span><b>Ordered on:</b> {new Date(date).toLocaleString()}</span>{" "}
      </div>
      <span><b>Amount Paid:</b> {(order.paymentIntent.amount / 100).toLocaleString('en-US', {
        style: "currency",
	      currency: 'INR',
      })}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span><b>Currency:</b> {order.paymentIntent.currency.toUpperCase()}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span><b>Payment Method:</b> {order.paymentIntent.payment_method_types[0].toUpperCase()}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <span><b>Payment:</b> {order.paymentIntent.status.toUpperCase()}</span>
      
      <div className="mt-1 h4">
	      <span className={`badge rounded-pill text-white ${order.orderStatus === "Completed" ? `bg-success` : (order.orderStatus === "Cancelled" ? `bg-danger`: `bg-info`)}`}>
		      STATUS: {order.orderStatus}
	      </span>
      </div>
    </div>
  );
};

export default ShowPaymentInfo;