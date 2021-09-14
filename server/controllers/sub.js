const Sub = require("../models/sub");
const Product = require("../models/product");
const slugify = require("slugify");

exports.create = async (req, res) =>{
	
	try{
		const {name, parent} = req.body;
		
		const category = await new Sub({name, parent, slug: slugify(name)}).save();
		
		res.json(category);
		
	}
	catch(err){
		console.log(err);
		res.status(400).send("Create sub failed");
	}
	
};

exports.read = async (req, res) =>{
	const {slug} = req.params;
	
	const sub = await Sub.findOne({slug}).exec();
	
	const products = await Product.find({subs: sub})
		.populate('category')
		.exec();
	
	res.json({
		sub,
		products
	});
	
};

exports.update = async (req, res) =>{
	
	try{
		const {name, parent} = req.body;
		
		const updated = await Sub.findOneAndUpdate({slug: req.params.slug}, {name, slug: slugify(name), parent}, {new: true});
		
		res.json(updated);
	}
	catch(err){
		console.log(err);
		res.status(400).send("Update sub failed");
	}
	
};

exports.remove = async (req, res) =>{
	
	try{
		const sub = await Sub.findOneAndDelete({slug: req.params.slug});
		res.json(sub);
	}
	catch(err){
		console.log(err);
		res.status(404).send("Delete sub Failed");
	}
	
};

exports.list = async (req, res) =>{
	res.json(await Sub.find({}).sort({createdAt: -1}).exec());
};