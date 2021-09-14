const User = require("../models/user");


exports.createOrUpdateUser = async (req,res)=>{

  const {email, picture, name} = req.user;
  const user = await User.findOneAndUpdate({email}, {name: email.split('@')[0], picture}, {new:true, useFindAndModify:false});

  if(user){
    res.json(user);
    console.log("UPDATED USER",user);
  }else{
    const newUser = await new User({email, picture, name: email.split('@')[0]}).save();
    res.json(newUser);
    console.log("NEW USER",newUser);
  }

};

exports.currentUser = async (req, res) => {
	
	User.findOne({email: req.user.email}).exec((err, user) => {
		if(err) throw new Error(err);
		res.json(user);
	});
	
};