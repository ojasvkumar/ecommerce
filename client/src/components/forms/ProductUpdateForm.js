import React from 'react';
import { Select } from 'antd';
const { Option } = Select;

const ProductUpdateForm = ({
	handleSubmit,
	handleChange,
	values,
	setValues,
	handleCategoryChange,
	categories,
	subOptions,
	arrayOfSubIds,
	setArrayOfSubIds,
	selectedCategory,
}) => {
	
	const {title, description, price, category, shipping, quantity, colors, brands, color, brand} = values;
	
	return (
		<form onSubmit={handleSubmit}>
			<div className="form-group">
				<label>Title</label>
				<input type="text" name="title" className="form-control" value={title} onChange={handleChange} />
			</div>
			
			<div className="form-group">
				<label>Description</label>
				<input type="text-box" name="description" className="form-control" value={description} onChange={handleChange} />
			</div>
			
			<div className="form-group">
				<label>Price</label>
				<input type="text" name="price" className="form-control" value={price} onChange={handleChange} />
			</div>
			
			<div className="form-group">
				<label>Shipping</label>
				<select name="shipping" className="form-control" onChange={handleChange} value={shipping}>
					<option disabled>Please Select</option>
					<option value="No">No</option>
					<option value="Yes">Yes</option>
				</select>
			</div>
			
			<div className="form-group">
				<label>Quantity</label>
				<input type="number" name="quantity" className="form-control" value={quantity} onChange={handleChange} />
			</div>
			
			<div className="form-group">
				<label>Colour</label>
				<select name="color" className="form-control" onChange={handleChange} value={color}>
					<option disabled>Please Select</option>
					{
						colors.map(c => <option key={c} value={c}>
							{c}
						</option>)
					}
				</select>
			</div>
			
			<div className="form-group">
				<label>Brand</label>
				<select name="brand" className="form-control" onChange={handleChange} value={brand}>
					<option disabled>Please Select</option>
					{
						brands.map(b => <option key={b} value={b}>
							{b}
						</option>)
					}
				</select>
			</div>

			<div className="form-group">
				<label>Category</label>
				<select name="category" className="form-control" onChange={handleCategoryChange}  value={selectedCategory ? selectedCategory : category._id}>
					<option value="Please Select" disabled>Please Select</option>
					{
						categories[0] && categories.map(c => {
							return(
								<option key={c._id} value={c._id}>
									{c.name}
								</option>
							);
						})
					}
				</select>
			</div>
			
			<div>
				<label>Sub Category</label>
				<Select
					mode="multiple"
					style={{width: '100%'}}
					placeholder="Please select"
					value={arrayOfSubIds}
					onChange={value => setArrayOfSubIds(value)}
				>
					{subOptions[0] && subOptions.map(s => (
						<Option value={s._id} key={s._id}>
							{s.name}
						</Option>
					))}
				</Select>
			</div>
			
			<br />
			
			<button className="btn btn-outline-info">Save</button>
		
		</form>
	);
};

export default ProductUpdateForm;