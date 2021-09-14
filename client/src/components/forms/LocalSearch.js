import React from 'react';

const LocalSearch = ({keyword, setKeyword}) => {
	
	const handleSearchChange = (e) => {
		e.preventDefault();
		setKeyword(e.target.value);
	};
	
  return (
		  <input type="search" value={keyword} placeholder="Search" onChange={handleSearchChange} className="form form-control mb-5" />
  );
};

export default LocalSearch;