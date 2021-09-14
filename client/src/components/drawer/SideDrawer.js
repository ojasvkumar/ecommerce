import React from 'react';
import {Drawer, Badge} from "antd";
import {useSelector, useDispatch} from "react-redux";
import {Link} from 'react-router-dom';
import noImage from '../../images/noImage.jpg';
import {CloseCircleOutlined} from '@ant-design/icons';

const SideDrawer = () => {
	
	const dispatch = useDispatch();
	const {drawer, cart} = useSelector(state => ({...state}));
	
	const imageStyle = {
		width: '100%',
		height: '90px',
		objectFit: 'cover'
	}
	
	const handleRemove = (p) => {
		let cart = [];
		
		if(typeof window !== undefined){
			if(localStorage.getItem('cart')){
				cart = JSON.parse(localStorage.getItem('cart'));
			}
			console.log(p);
			cart.map((product, i) => {
				if(product._id === p._id ){
					cart.splice(i, 1);
				}
			});
			
			localStorage.setItem('cart', JSON.stringify(cart));
			
			dispatch({
				type: 'ADD_TO_CART',
				payload: cart
			});
			
		}
	};
	
  return (
    <Drawer
	    onClose={() => {
	    	dispatch({
		    type: 'SET_VISIBLE',
		    payload: false})
	    }}
	    className="text-center"
	    title={`Cart / ${cart.length} Product/s`}
	    placement="right"
	    closable={false} // close icon
	    visible={drawer}
    >
	    {
	    	cart.map(p => <div className="row" key={p._id}>
			    <Badge count={
			    	<CloseCircleOutlined className="text-danger h4" onClick={() => handleRemove(p)}/>
			    } offset={[-5,0]}>
				    <div className="col">
					    {p.images[0] ? (
						    <>
							    <img src={p.images[0].url} style={imageStyle} alt=""/>
							    <p className="text-center bg-secondary text-light">
								    {p.title} x {p.count}
							    </p>
						    </>
					    ) : (
						    <>
							    <img src={noImage} style={imageStyle} alt=""/>
							    <p className="text-center bg-secondary text-light">
								    {p.title} x {p.count}
							    </p>
						    </>
					    )}
				    </div>
			    </Badge>
		    </div>)
	    }
	    
	    <Link to="/cart">
		   <button
			   className="text-center btn btn-primary btn-block btn-raised"
			   onClick={() => {
			   	dispatch({
				    type:"SET_VISIBLE",
				    payload: false
			    });
			   }}
		   >
			   Go To Cart
		   </button>
	    </Link>
    </Drawer>
  );
};

export default SideDrawer;