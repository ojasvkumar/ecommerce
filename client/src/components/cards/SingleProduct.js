import React, {useState} from 'react';
import {Card, Tabs, Tooltip} from "antd";
import {Link, useHistory} from 'react-router-dom';
import {HeartOutlined, ShoppingCartOutlined} from '@ant-design/icons';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import noImage from '../../images/noImage.jpg';
import ProductListItems from "./ProductListItems";
import StarRatings from "react-star-ratings";
import RatingModal from "../modal/RatingModal";
import {showAverage} from "../../functions/rating";
import {addToWishlist} from "../../functions/user";
import {useDispatch, useSelector} from 'react-redux';
import _ from 'lodash';
import {toast} from 'react-toastify';

const {TabPane} = Tabs;

const SingleProduct = ({product, onStarClick, star}) => {
	
	const {title, images, description, _id, quantity} = product;
	const [tooltip, setTooltip] = useState("Click to add");
	const dispatch = useDispatch();
	const {user, cart} = useSelector(state => ({...state}));
	
	const history = useHistory();
	
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
	
	const handleAddToWishlist = (e) => {
		e.preventDefault();
		
		addToWishlist(user.token, _id)
			.then(res => {
				//console.log(res.data);
				toast(`Added to wishlist`);
				history.push('/user/wishlist');
			})
		
	};
	
	
  return (
    <>
	    
      <div className="col-md-7">
	      {images && images.length ? (<Carousel showArrows={true} autoPlay infiniteLoop>
		      {images && images.map(i => <img src={i.url} key={i.public_id} alt=""/>)}
	      </Carousel>) : (<Card cover={<img src={noImage} style={{height:'450px', objectFit:'contain' }} className="mb-3" alt=""/>}> </Card>)}
      
	      <Tabs type="card">
		      <TabPane tab="Description" key="1">
			      {description && description}
		      </TabPane>
		      <TabPane tab="More" key="2">
			      Call us on +91-97XXXXXX79 to learn more about this product
		      </TabPane>
	      </Tabs>
      
      </div>
	    <div className="col-md-5">
		    <h1 className="bg-info p-3">{title}</h1>
		    
		    {product && product.ratings && product.ratings.length
			    ? showAverage(product)
		      : <div className="text-center pt-1 pb-3">
				    No Rating yet.
			    </div>}
		    
		    <Card actions={[
			    <Tooltip title={tooltip}>
				    <a onClick={handleAddToCart} disabled={quantity < 1}>
					    <ShoppingCartOutlined className="text-success" /> <br />
					    {quantity < 1 ? 'Out of Stock' : 'Add to Cart'}
				    </a>
			    </Tooltip>,
			    <a onClick={handleAddToWishlist}>
				    <HeartOutlined className="text-info"/> <br/> Add to Wishlist
			    </a>,
			    <RatingModal>
				
				    <StarRatings
					    name={_id}
					    numberOfStars={5}
					    rating={star}
					    changeRating={onStarClick}
					    isSelectable={true}
					    starRatedColor="red"
				    />
			
			    </RatingModal>
		    ]}>
			    <ProductListItems product={product} />
		    </Card>
	    </div>
    </>
  );
};

export default SingleProduct;