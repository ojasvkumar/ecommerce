import React, {useEffect, useState} from 'react';
import {getProduct, productStar, getRelated} from "../functions/product";
import SingleProduct from "../components/cards/SingleProduct";
import {useSelector} from "react-redux";
import ProductCard from "../components/cards/ProductCard";


const Product = ({match}) => {
	
	const [product, setProduct] = useState({});
	const [star, setStar] = useState(0);
	const [related, setRelated] = useState([]);
	const {user} = useSelector(state => ({...state}));
	
	const {slug} = match.params;
	
	const loadSingleProduct = () => {
		getProduct(slug)
			.then(res=> {
				setProduct(res.data)
				
				getRelated(res.data._id)
					.then(res => {
						setRelated(res.data);
					})
					.catch(err => console.error(err));
			})
			.catch(err => console.error(err));
		
	};
	
	const onStarClick = (newRating, name) =>{
		setStar(newRating);
		productStar(name, newRating, user.token)
			.then(res=>{
				console.log(res.data);
				loadSingleProduct();
			})
			.catch(err=>{
				console.log(err);
			})
	};
	
	useEffect(()=> {
		loadSingleProduct();
	},[slug]);
	
	useEffect(()=> {
		if(product.ratings && user && user._id){
			let existingRatingObject = product.ratings.find((element)=> {
				//console.log(element.postedBy, "    ", user._id);
				return element.postedBy.toString() === user._id.toString();
			});
			existingRatingObject && setStar(existingRatingObject.star);
		}
	});
	
  return (
    <div className="container-fluid">
	    <div className="row pt-4">
		    <SingleProduct product={product} star={star} onStarClick={onStarClick} />
	    </div>
		    
	    <div className="row">
		    <div className="col text-center pt-5 pb-2">
			    <hr />
			      <h4> Related Products </h4>
			    <hr />
		    </div>
	    </div>
	    
	    <div className="row pb-5">
		    {
		    	related.length ?
				    related.map((r) => {
				    	return(
						    <div key={r._id} className="col-md-4">
							    <ProductCard product={r}/>
						    </div>
					    );
				    })
				    : <div className="text-center col">
				    No Product Found
				    </div>
		    }
	    </div>
	    
    </div>
  );
};

export default Product;