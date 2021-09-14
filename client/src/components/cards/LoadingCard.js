import React from 'react';
import {Card, Skeleton} from 'antd';

const LoadingCard = ({count}) => {
	
	let cards = () => {
		let totalCards = [];
		
		for(let i = 0; i < count; i++){
			totalCards.push(
				<div className="col-md-4 mb-3" key={i}>
					<Card className="p-1">
						<Skeleton active ></Skeleton>
					</Card>
				</div>
			)
		}
		
		return totalCards;
	};
	
  return (
    <div className="row">{cards()}</div>
  );
};

export default LoadingCard;