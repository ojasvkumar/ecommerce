import React, {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';

const LoadingToRedirect = () => {
	
	const history = useHistory();
	
	const [count,setCount] = useState(5);
	
	useEffect(()=> {
		
		const interval = setInterval(()=>{
			setCount(currentCount => --currentCount);
		}, 1000);
		
		count===0 && history.push('/');
		
		return ()=> clearInterval(interval);
		
	},[count, history]);
	
  return (
    <div className="container p-5 text-center">
	    Redirecting you in {count} seconds
    </div>
  	
  );
};

export default LoadingToRedirect;