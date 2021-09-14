const Category = require("../models/category");
const Product = require("../models/product");
const Sub = require("../models/sub")
const slugify = require("slugify");

exports.create = async (req, res) =>{
	
	try{
		const {name} = req.body;
		
		const category = await new Category({name, slug: slugify(name)}).save();
		
		res.json(category);
		
	}
	catch(err){
		console.log(err);
		res.status(400).send("Create category failed");
	}
	
};

exports.read = async (req, res) =>{
	const {slug} = req.params;
	
	const category = await Category.findOne({slug}).exec();
	
	const products = await Product.find({category})
		.populate('category')
		.exec();
	
	
	res.json({
		category,
		products
	});
	
};

exports.update = async (req, res) =>{
	
	try{
		const {name} = req.body;
		
		const updated = await Category.findOneAndUpdate({slug: req.params.slug}, {name, slug: slugify(name)}, {new: true});
		
		res.json(updated);
	}
	catch(err){
		console.log(err);
		res.status(400).send("Update category failed");
	}
	
};

exports.remove = async (req, res) =>{
	
	try{
		const category = await Category.findOneAndDelete({slug: req.params.slug});
		res.json(category);
	}
	catch(err){
		console.log(err);
		res.status(404).send("Delete Category Failed");
	}
	
};

exports.list = async (req, res) =>{
	res.json(await Category.find({}).sort({createdAt: -1}).exec());
};

exports.getSubs = (req, res) => {
	Sub.find({parent: req.params._id}).exec((err, subs) => {
		if(err) console.log(err);
		else res.json(subs);
	})
};