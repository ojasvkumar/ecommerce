import React, {useState, useEffect} from 'react';
import {getCategory} from "../../functions/category";
import ProductCard from "../../components/cards/ProductCard";

const CategoryHome = ({match}) => {
	
	const [category, setCategory] = useState({});
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	
	const {slug} = match.params;
	
	useEffect(()=> {
		setLoading(true);
		getCategory(slug)
			.then(c=> {
				//console.log(JSON.stringify(c.data, null, 4));
				setCategory(c.data.category);
				setProducts(c.data.products);
				setLoading(false);
			})
	}, []);
	
	
	
  return (
    <div className="container">
	    <div className="row">
		    <div className="col">
			    {
			    	loading ? (
			    		<h4 className="jumbotron text-center display-4 p-3 mt-5 mb-5">Loading...</h4>
				    ) : (
					    <h4 className="jumbotron text-center display-4 p-3 mt-5 mb-5">
						    {products.length} Products in "{category.name}" Category
					    </h4>
				    )
			    }
		    </div>
	    </div>
	    
	    <div className="row">
		    {products.map((product) => (
		    	<div className="col" key={product._id}>
			      <ProductCard product={product}/>
			    </div>
			    ))}
	    </div>
    </div>
  );
};

export default CategoryHome;