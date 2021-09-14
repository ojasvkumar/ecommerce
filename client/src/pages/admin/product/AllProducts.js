import React, {useState, useEffect}from 'react';
import AdminNav from "../../../components/nav/AdminNav";
import {getProductsByCount, removeProduct} from "../../../functions/product";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';

const AllProducts = () => {
	
	const {user} = useSelector(state => ({...state}));
	
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	
	useEffect(()=> {
		loadAllProducts();
	}, []);
	
	
	const loadAllProducts = () => {
		setLoading(true);
		getProductsByCount(100)
			.then(res => {
				setLoading(false);
				setProducts(res.data)
			})
			.catch(err => console.error(err));
	}
	
	const handleRemove = (slug) => {
		
		if(window.confirm('Are you sure you want to Delete this product?')){
			removeProduct(slug,user.token)
				.then((res) => {
					loadAllProducts();
					toast.success(`${res.data.title} is deleted`)
				})
				.catch(err => {
					setLoading(false);
					toast.error(err.response.data);
					console.error(err);
				})
		}
	};
	
	
	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-2"><AdminNav /></div>
				<div className="col-md-10">
					{loading ? <h4 className="text-danger">Loading...</h4> : <h4>All Products</h4>}
					<div className="row">
						{products.map(product=> <div className="col-md-4 pb-3" key={product._id}>
							<AdminProductCard product={product} handleRemove={handleRemove} />
						</div>)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AllProducts;