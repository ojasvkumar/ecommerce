import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {getSubs} from "../../functions/sub";

const SubList = () => {
	
	const [subs, setSubs] = useState([]);
	const [loading, setLoading] = useState(false);
	
	useEffect(()=> {
		
		setLoading(true);
		getSubs()
			.then(sub => {
				setSubs(sub.data);
				setLoading(false);
			})
			.catch(err => console.error(err));
		
	}, []);
	
	const showSubs = () => {
		return subs.map(sub =>
			<Link to={`/subs/${sub.slug}`} className="m-3 col"  key={sub._id}>
				<div className="btn btn-outlined-primary btn-lg btn-block btn-raised">
					{sub.name}
				</div>
			</Link>
		);
	};
	
	return (
		<div className="container">
			<div className="row">
				{
					loading ? (<h4 className="text-center"> Loading...</h4>) : showSubs()
				}
			</div>
		</div>
	);
};

export default SubList;