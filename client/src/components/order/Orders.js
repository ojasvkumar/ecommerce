import React from 'react';
import { CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import ShowPaymentInfo from "../cards/ShowPaymentInfo";
import {showOrderInTable} from "../../pages/user/History";


const Orders = ({orders, handleStatusChange}) => {
	
  return (
    <>
	    {
	    	orders.map(order => (
	    		<div key={order._id} className="pb-5">

				    <div className={`btn col mb-3 btn-raised ${order.orderStatus === "Completed" ? `bg-success disabled-div` : (order.orderStatus === "Cancelled" ? `bg-danger`: `bg-light`)}`}>
					    <ShowPaymentInfo order={order} />
					    <br />
					    <div className="row">
						    <div className="col-md-4 pt-2">
							    Delivery Status:
						    </div>
						    <div className="col-md-8">
							    <select className="form-control pt-0 pb-0" defaultValue={order.orderStatus} onChange={e => handleStatusChange(order._id, e.target.value)}>
								    <option value="Not Processed">Not Processed</option>
								    <option value="Processing">Processing</option>
								    <option value="Dispatched">Dispatched</option>
								    <option value="Cancelled">Cancelled</option>
								    <option value="Completed">Completed</option>
								    <option value="Cash on Delivery">Cash on Delivery</option>
							    </select>
						    </div>
					    </div>
				    </div>
				    {showOrderInTable(order)}
				    
				    <hr style={{height: '2px',border: 'none',color: 'rgba(170,170,170,0.2)',backgroundColor:'rgba(170,170,170,0.2)'}} />
				    
			    </div>
		    ))
	    }
    </>
  );
};

export default Orders;