import React, {useState, useEffect} from 'react';
import {getProductsByCount, fetchProductsByFilter} from "../functions/product";
import {getCategories} from "../functions/category";
import {getSubs} from "../functions/sub";
import {useSelector, useDispatch} from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import {Menu, Slider, Checkbox, Radio} from 'antd';
import {DollarOutlined, DownSquareOutlined, StarOutlined} from "@ant-design/icons";
import Stars from "../components/forms/Stars";

const {SubMenu, ItemGroup} = Menu;

const Shop = () => {
	
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [price, setPrice] = useState([0,500000]);
	const [categories, setCategories] = useState([]);
	const [subs, setSubs] = useState([]);
	const [sub, setSub] = useState('');
	const [categoryIds, setCategoryIds] = useState([]);
	const [star, setStar] = useState('');
	//const [brands, setBrands] = useState(["Apple","Dell", "Samsung", "Microsoft", "Asus", "HP"]);
	const [ok, setOk] = useState(false);
	const [brand, setBrand] = useState('');
	const [color, setColor] = useState('');
	const [shipping, setShipping] = useState("");
	
	const brands = ["Apple","Dell", "Samsung", "Microsoft", "Asus", "HP"];
	const colors = ["Black", "White", "Silver", "Blue", "Brown"];
	const dispatch = useDispatch();
	
	const {search} = useSelector(state => ({...state}));
	const {text} = search;
	
	const handleSlider = (value) => {
		dispatch({
			type: 'SEARCH_QUERY',
			payload: {text: ""},
		});
		
		//reset
		setBrand('');
		setCategoryIds([]);
		setStar('');
		setSub('');
		setColor('');
		setShipping('');
		
		setPrice(value);
		setTimeout(()=>{
			setOk(!ok);
		}, 500);
	};
	
	useEffect(()=> {
		loadAllProducts();
		loadAllCategories();
		loadAllSubs();
	}, []);
	
	const fetchProducts = (arg) => {
		fetchProductsByFilter(arg)
			.then(res => {
				setProducts(res.data);
			})
			.catch(err => console.error(err));
	};
	
	const loadAllCategories = () => {
		getCategories()
			.then(res => {
				setCategories(res.data);
			})
			.catch(err => console.error(err));
	}
	
	const loadAllSubs = () => {
		getSubs()
			.then(res => {
				setSubs(res.data);
			})
			.catch(err => console.error(err));
	}
	
	// load products on default page load
	const loadAllProducts = () => {
		getProductsByCount(12)
			.then(res => {
				setProducts(res.data);
			})
			.catch(err => console.error(err));
	};
	
	//load products based on search query
	useEffect(()=> {

		const delayed = setTimeout(() => {
			fetchProducts({query: text});
		}, 500);

		return ()=> clearTimeout(delayed);
	}, [text]);
	
	//load products based on price range
	useEffect(()=>{
		fetchProducts({price});
	}, [ok]);
	
	//load products based on Categories
	// show categories
	
	const showCategories = () => {
		return categories.map(c => <div key={c._id}>
			<Checkbox
				className="pb-2 pl-4 pr-4"
				value={c._id}
				name="category"
				onChange={handleCheck}
				checked={categoryIds.includes(c._id)}>
				{c.name}
			</Checkbox>
		</div>)
	};
	
	//handleCheck for categories
	const handleCheck = (e) => {
		dispatch({
			type: 'SEARCH_QUERY',
			payload: {text: ""},
		});
		
		//reset
		setBrand('');
		setStar('');
		setPrice([0,5000]);
		setSub('');
		setColor('');
		setShipping('');
		
		let inState = [...categoryIds];
		let justChecked = e.target.value;
		let foundInState = inState.indexOf(justChecked); // index or -1
		
		if(foundInState === -1){
			inState.push(justChecked);
		}
		else{
			inState.splice(foundInState, 1);
		}
		setCategoryIds(inState);
		
		fetchProducts({category: inState});
	};
	
	// search products by star ratings
	
	const handleStarClick = (num) => {
		dispatch({
			type: 'SEARCH_QUERY',
			payload: {text: ""},
		});
		setBrand('');
		setPrice([0, 5000]);
		setCategoryIds([]);
		setStar(num);
		setSub('');
		setShipping('');
		setColor('');
		
		fetchProducts({stars : num});
	};
	
	const showStars = () => {
		return (
			<div className="pr-4 pl-4 pb-2">
				<Stars starClick={handleStarClick} numberOfStars={5} />
				<Stars starClick={handleStarClick} numberOfStars={4} />
				<Stars starClick={handleStarClick} numberOfStars={3} />
				<Stars starClick={handleStarClick} numberOfStars={2} />
				<Stars starClick={handleStarClick} numberOfStars={1} />
			</div>
		);
	};
	
	const handleSubs = (sub) => {
		setSub(sub);
		
		dispatch({
			type: 'SEARCH_QUERY',
			payload: {text: ""},
		});
		setBrand('');
		setPrice([0, 5000]);
		setCategoryIds([]);
		setStar('');
		setColor('');
		setShipping('');
		
		fetchProducts({sub});
	};
	
	const showSubs = () => {
		return subs.map(s =>
			<div
				key={s._id}
				className="p-1 m-1 badge badge-secondary"
				style={{cursor:'pointer'}}
				onClick={()=>handleSubs(s)}>
				{s.name}
			</div>
		);
	};
	
	const handleBrand = (e) => {
		
		dispatch({
			type: 'SEARCH_QUERY',
			payload: {text: ""},
		});
		
		//reset
		setStar('');
		setPrice([0,5000]);
		setSub('');
		setCategoryIds([]);
		setColor('');
		setShipping('');
		setBrand(e.target.value);
		
		fetchProducts({brand: e.target.value});
		
	};
	
	const showBrands = () => {
		return brands.map(b => (<Radio
			value={b}
			key={b}
			name={b}
			checked={b === brand}
			onChange={handleBrand}
			className="pb-1 mr-5 pr-5"
		>{b}</Radio>));
	};
	
	const handleColor = (e) => {
		dispatch({
			type: 'SEARCH_QUERY',
			payload: {text: ""},
		});
		
		//reset
		setStar('');
		setPrice([0,5000]);
		setSub('');
		setCategoryIds([]);
		setBrand('');
		setShipping('');
		
		setColor(e.target.value);
		
		fetchProducts({color: e.target.value});
	};
	
	const showColors = () => {
		return colors.map(c => (<Radio
			value={c}
			key={c}
			name={c}
			checked={c === color}
			onChange={handleColor}
			className="pb-1 mr-5 pr-5"
		>{c}</Radio>));
	};
	
	const handleShipping = (e) => {
		dispatch({
			type: 'SEARCH_QUERY',
			payload: {text: ""},
		});
		
		//reset
		setStar('');
		setPrice([0,5000]);
		setSub('');
		setCategoryIds([]);
		setBrand('');
		setColor('');
		
		setShipping(e.target.value);
		
		fetchProducts({shipping: e.target.value});
	};
	
	const showShipping = () => {
		return (
			<>
				<Checkbox
					className="pb-2 pl-4 pr-4"
					onChange={handleShipping}
					value="Yes"
					checked={shipping === 'Yes'}>
					Yes
				</Checkbox>
				<Checkbox
					className="pb-2 pl-4 pr-4"
					onChange={handleShipping}
					value="No"
					checked={shipping === 'No'}>
					No
				</Checkbox>
			</>
		)
	};
	
	useEffect(()=> {
		if(products.length === 0){
			loadAllProducts();
		}
	}, [products]);
	
  return (
    <div className="container-fluid">
      <div className="row">
	      <div className="col-md-3 pt-3 pb-5">
		      <h4>Search/Filter</h4>
		      <hr />
		      
		      <Menu mode="inline" defaultOpenKeys={["1", "2", "3", "4", "5", "6", "7"]}>
			      
			      <SubMenu key="1" title={<span className="h6">
				      <DollarOutlined style={{fontSize:'16px', marginRight:'2px'}} /> Price
			      </span>}>
				      <div>
					      <Slider
						      className="ml-4 mr-4"
						      tipFormatter={(v) => `₹${v}`}
						      range
						      value={price}
						      onChange={(value) => handleSlider(value)}
					        max="500000"/>
				      </div>
			      </SubMenu>
			
			      <SubMenu key="2" title={<span className="h6">
				      <DownSquareOutlined style={{fontSize:'16px', marginRight:'2px'}} /> Category
			      </span>}>
				      <div>
					      {showCategories()}
				      </div>
			      </SubMenu>
			
			      <SubMenu key="3" title={<span className="h6">
				      <StarOutlined style={{fontSize:'16px', marginRight:'2px'}} /> Rating
			      </span>}>
				      <div>
					      {showStars()}
				      </div>
			      </SubMenu>
			
			      <SubMenu key="4" title={<span className="h6">
				      <DownSquareOutlined style={{fontSize:'16px', marginRight:'2px'}} /> Sub Categories
			      </span>}>
				      <div className="pl-4 pr-4">
					      {showSubs()}
				      </div>
			      </SubMenu>
			
			      <SubMenu key="5" title={<span className="h6">
				      <DownSquareOutlined style={{fontSize:'16px', marginRight:'2px'}} /> Brands
			      </span>}>
				      <div className="pl-4 pr-4">
					      {showBrands()}
				      </div>
			      </SubMenu>
			
			      <SubMenu key="6" title={<span className="h6">
				      <DownSquareOutlined style={{fontSize:'16px', marginRight:'2px'}} /> Colors
			      </span>}>
				      <div className="pl-4 pr-4">
					      {showColors()}
				      </div>
			      </SubMenu>
			
			      <SubMenu key="7" title={<span className="h6">
				      <DownSquareOutlined style={{fontSize:'16px', marginRight:'2px'}} /> Shipping
			      </span>}>
				      <div className="pl-4 pr-4">
					      {showShipping()}
				      </div>
			      </SubMenu>
			      
			      
			      
		      </Menu>
		      
	      </div>
	      <div className="col-md-9 pt-3 pb-5">
		      {loading ? (
		      	<h4 className="text-danger">Loading...</h4>
		      ): (
		      	<h4 className="text-danger display-3 text-center mb-5">Products</h4>
		      )}
		      
		      {products.length < 1 && <p>No Products Found</p>}
		      <div className="row pb-5">
			      {products.map(p => {
			      	return (
					      <div className="col-md-4 mb-5" key={p._id}>
						      <ProductCard product={p} />
					      </div>
				      )
			      })}
		      </div>
	      </div>
      </div>
    </div>
  );
};

export default Shop;