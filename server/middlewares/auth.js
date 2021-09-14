const admin = require("../firebase/index");
const User = require("../models/user");

exports.authCheck = async (req,res,next) => {
	//console.log(req.headers.authtoken);
  try{
    const  firebaseUser = await admin.auth().verifyIdToken(req.headers.authtoken);
		//console.log(firebaseUser);
    req.user = firebaseUser;
    next();
  }catch (e) {
    console.log("AUTH CHECK ERROR", e);
    await res.status(401).json({
      e:"Invalid or expired Token"
    });
  }

};

exports.adminCheck = async (req,res,next) => {
	
	const {email} = req.user;
	
	const adminUser = await User.findOne({email}).exec();
	
	if(adminUser.role !== 'admin'){
		await res.status(403).json({
			err: `Admin resource. Access Denied.`
		});
	}
	else{
		next();
	}
};