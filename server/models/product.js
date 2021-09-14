const mongoose = require('mongoose');

const {ObjectId} = mongoose.Schema;

const productSchema = new mongoose.Schema({
	title:{
		type:String,
		required: true,
		text: true,
		maxlength:32,
		trim:true
	},
	slug:{
		type:String,
		unique: true,
		lowercase: true,
		index:true,
	},
	description:{
		type:String,
		required: true,
		text: true,
		maxlength:2000
	},
	price:{
		type: Number,
		required: true,
		trim:true,
		maxlength:32
	},
	category:{
		type:ObjectId,
		ref: 'Category'
	},
	subs: [{
		type:ObjectId,
		ref: 'Sub'
	}],
	quantity:{
		type:Number,
	},
	sold:{
		type:Number,
		default:0
	},
	images:{
		type:Array
	},
	shipping:{
		type: String,
		enum:["Yes","No"]
	},
	color:{
		type:String,
		enum:["Black", "White", "Silver", "Blue", "Brown"]
	},
	brand:{
		type:String,
		enum:["Apple","Dell", "Samsung", "Microsoft", "Asus", "HP"]
	},
	ratings:[{
		star: Number,
		postedBy:{type: ObjectId, ref:'User'}
	}]
}, {timestamps:true});

module.exports = mongoose.model('Product', productSchema);