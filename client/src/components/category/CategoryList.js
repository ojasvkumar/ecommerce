import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {getCategories} from "../../functions/category";

const CategoryList = () => {
	
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(false);
	
	useEffect(()=> {
		
		setLoading(true);
		getCategories()
			.then(category => {
				setCategories(category.data);
				setLoading(false);
			})
			.catch(err => console.error(err));
		
	}, []);
	
	const showCategories = () => {
		return categories.map(category =>
				<Link to={`/category/${category.slug}`} className="m-3 col"  key={category._id}>
					<div className="btn btn-outlined-primary btn-lg btn-block btn-raised">
						{category.name}
					</div>
				</Link>
		);
	};
	
  return (
    <div className="container">
	    <div className="row">
		    {
		    	loading ? (<h4 className="text-center"> Loading...</h4>) : showCategories()
		    }
	    </div>
    </div>
  );
};

export default CategoryList;