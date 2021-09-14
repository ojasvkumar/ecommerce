import React, {useState} from 'react';
import {Card, Tooltip} from "antd";
import { EyeOutlined, ShoppingCartOutlined} from "@ant-design/icons";
import noImage from '../../images/noImage.jpg';
import {Link} from 'react-router-dom';
import {showAverage} from "../../functions/rating";
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';

const {Meta} = Card;

const ProductCard= ({product, loading}) => {
	
	const [tooltip, setTooltip] = useState("Click to add");
	const dispatch = useDispatch();
	const {user, cart} = useSelector(state => ({...state}));
	const {title, description, images, slug, price, quantity} = product;
	
	const compare = (obj, other) => {
		return obj._id === other._id;
	};
	
	const handleAddToCart = () => {
		setTooltip("Added");
		let cart = [];
		if(typeof window !== undefined){
			if(localStorage.getItem('cart')){
				cart = JSON.parse(localStorage.getItem('cart'));
			}
			cart.push({
				...product,
				count: 1,
			});
			//remove duplicates
			
			let unique = _.uniqWith(cart, compare);
			localStorage.setItem('cart', JSON.stringify(unique));
			
			//dispatch to redux store
			dispatch({
				type: 'ADD_TO_CART',
				payload: unique
			});
			
			//show cart items in side drawer
			dispatch({
				type: 'SET_VISIBLE',
				payload: true
			});
			
		}
	};
	
	return (
   <>
	
	   {product && product.ratings && product.ratings.length
		   ? showAverage(product)
		   : <div className="text-center pt-1 pb-3">
			   No Rating yet.
		   </div>}
	   
	   <Card cover={<img src={images.length > 0 ? images[0].url : noImage} style={{height:'150px', objectFit:'cover'}} className="p-1" alt="Product" />}
	         actions={
		         [<Link to={`/product/${slug}`}> <EyeOutlined className="text-info"/> <br/> View Product </Link>,
			         <Tooltip title={tooltip}>
				         <a onClick={handleAddToCart} disabled={quantity<1}> <ShoppingCartOutlined className="text-success" />  <br/>
					         {quantity < 1 ? 'Out of Stock' : 'Add to Cart'}
				         </a>
			         </Tooltip>]
	         }
	   >
		   
		   <Meta title={`${title} - ₹${price}`} description={`${description && description.substring(0, 20)}...`}/>
	
	   </Card>
   </>
  );
};

export default ProductCard;