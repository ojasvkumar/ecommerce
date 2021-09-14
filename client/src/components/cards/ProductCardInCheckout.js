import React from 'react';
import ModalImage from 'react-modal-image';
import noImage from '../../images/noImage.jpg';
import {useDispatch} from "react-redux";
import {toast} from 'react-toastify';
import {CheckCircleOutlined, CloseCircleOutlined, CloseOutlined} from '@ant-design/icons';

const ProductCardInCheckout = ({product}) => {
	
	const {title, images, shipping, brand, color, count, price, _id, quantity} = product;
	
	const colors = ["Black", "White", "Silver", "Blue", "Brown"];
	
	const dispatch = useDispatch();
	
	const handleColorChange = (e) => {
		
		let cart = [];
		
		if(typeof window !== undefined){
			if(localStorage.getItem('cart')){
				cart = JSON.parse(localStorage.getItem('cart'));
			}
			
			cart.map((product, i) => {
				if(product._id === _id){
					cart[i].color = e.target.value;
				}
			});
			
			localStorage.setItem('cart', JSON.stringify(cart));
			
			dispatch({
				type: 'ADD_TO_CART',
				payload: cart
			});
		}
	};
	
	const handleCountChange = (e) =>{
		let cart = [];
		let count = e.target.value < 1 ? 1 : e.target.value;
		
		if(count > quantity){
			toast.error(`Maximum available quantity is ${quantity} units`);
			return;
		}
		
		if(typeof window !== undefined){
			if(localStorage.getItem('cart')){
				cart = JSON.parse(localStorage.getItem('cart'));
			}
			
			cart.map((product, i) => {
				if(product._id === _id ){
					cart[i].count = count;
				}
			});
			
			localStorage.setItem('cart', JSON.stringify(cart));
			
			dispatch({
				type: 'ADD_TO_CART',
				payload: cart
			});
		}
	};
	
	const handleRemove = (e) => {
		let cart = [];
		
		if(typeof window !== undefined){
			if(localStorage.getItem('cart')){
				cart = JSON.parse(localStorage.getItem('cart'));
			}
			
			cart.map((product, i) => {
				if(product._id === _id ){
					cart.splice(i, 1);
				}
			});
			
			localStorage.setItem('cart', JSON.stringify(cart));
			
			dispatch({
				type: 'ADD_TO_CART',
				payload: cart
			});
			
			dispatch({
				type: 'COUPON_APPLIED',
				payload: false
			});
			
		}
	};
	
  return (
    <tbody>
	    <tr>
		    <td>
			    <div style={{width: '100px', height:"auto"}}>
				    {images.length > 0 ? ( <ModalImage small={images[0].url} large={images[0].url} />) : (
					    <ModalImage small={noImage} large={noImage} />
					    )}
		      </div>
		    </td>
		    <td>{title}</td>
		    <td >{price}</td>
		    <td>{brand}</td>
		    <td>
			    <select className="form-control" name="color" onChange={handleColorChange}>
				    {color ? <option value={color}>{color}</option> : <option value="Select">Select</option>}
				    {colors.filter((c) => c !== color).map(c => (<option value={c} key={c}>
					    {c}
				    </option>))}
			    </select>
		    </td>
		    <td>
			    <input type="number" min="1" max={quantity} className="form-control" value={count} onChange={handleCountChange} />
		    </td>
		    <td className="text-center">
			    {shipping === "Yes" ? <CheckCircleOutlined style={{fontSize: '30px'}} className="text-success" /> : <CloseCircleOutlined style={{fontSize: '30px'}} className="text-danger" />}</td>
		    <td className="text-center">
			    <CloseOutlined style={{fontSize: '30px'}} onClick={handleRemove} className="text-danger pointer" />
		    </td>
	    </tr>
    </tbody>
  );
};

export default ProductCardInCheckout;