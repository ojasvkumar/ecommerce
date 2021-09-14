import React from 'react';

const CategoryForm = ({handleSubmit, name, setName, loading}) => {
	return(
		<form onSubmit={handleSubmit}>
			<label>Name</label>
			<input type="text" className="form-control" value={name} onChange={(e)=> setName(e.target.value)} autoFocus required/>
			<button className="btn btn-outline-primary mt-2" disabled={loading && name.length<2} > Save </button>
		</form>
	);
};

export default CategoryForm;