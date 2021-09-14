import React from 'react';
import StarRatings from "react-star-ratings";

export const showAverage = (p) => {
	
	if(p && p.ratings){
		let ratingsArray = p && p.ratings;
		let total = [];
		
		let length = ratingsArray.length;
		
		ratingsArray.map((r) => total.push(r.star));
		
		let totalReduced = total.reduce((p,n) => p + n, 0);
		//console.log("totalReduced",totalReduced);
		
		let highest = length * 5;
		
		let result = totalReduced * 5 / highest;
		//console.log("result",result);
		
		return (
			<div className="text-center pt-1 pb-3">
				<span>
					<StarRatings
						rating={result}
						starDimension="20px"
						starRatedColor="red"
						starSpacing="2px"
						editing={false}
					/>{"  "}
					({p.ratings.length})
				</span>
			</div>
		);
 	}
	
};