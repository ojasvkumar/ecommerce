import React, {useState, useEffect} from 'react';
import UserNav from "../../components/nav/UserNav";
import {getWishlist, removeWishlist} from "../../functions/user";
import {Link} from 'react-router-dom';
import {Badge} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {DeleteOutlined} from "@ant-design/icons";
import ProductCard from "../../components/cards/ProductCard";

const Wishlist = () => {
	
	const [wishlist, setWishlist] = useState([]);
	
	const dispatch = useDispatch();
	const {user} = useSelector(state => ({...state}));
	
	useEffect(()=> {
		loadWishlist();
	}, []);
	
	const loadWishlist = () => {
		getWishlist(user.token)
			.then(res => {
				setWishlist(res.data[0].wishlist);
			})
	};
	
	const handleRemove = (productId) => {
		removeWishlist(user.token, productId)
			.then(res =>{
				loadWishlist();
			})
	};
	
	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-2"><UserNav /></div>
				<div className="col">
					<h4>Wishlist</h4>
					<div className="row">
						{
							wishlist && wishlist.length > 0 && wishlist.map(p => (
								
								<div key={p._id} className="col-md-4">
									{/*<Link to={`/product/${p.slug}`} className="h6">{p.title}</Link>*/}
									{/*<span className="btn btn-sm float-right p-0" onClick={() => handleRemove(p._id)}>*/}
									{/*	<DeleteOutlined className="text-danger h5" />*/}
									{/*</span>*/}
									
									<ProductCard product={p} />
									<div className="btn btn-outline-danger btn-floating col pt-2 pb-1 mt-1" onClick={() => handleRemove(p._id)}>
										<DeleteOutlined className=" h5" />
									</div>
								</div>
								
							))
						}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Wishlist;