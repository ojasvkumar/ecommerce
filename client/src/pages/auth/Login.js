import React, {useState, useEffect} from "react";
import {Link, useHistory} from 'react-router-dom';
import {auth, googleAuthProvider} from "../../firebase";
import { Button } from 'antd';
import { MailOutlined, GoogleOutlined } from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {createOrUpdateUser} from "../../functions/auth";


const Login = () => {

  const history = useHistory();
  const [email,setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const {user} = useSelector((state) => ({...state}));

  useEffect(()=>{
	  let intended = history.location.state;
		
	  if(intended) return;
		else{
		  if(user && user.token){
			  history.push("/");
		  }
	  }
  }, [user, history]);


  const roleBasedRedirect = (res) => {
  	
  	//check if there is any intended routing
	  
	  let intended = history.location.state;
	  if(intended){
	  	history.push(intended.from);
	  }
	  else{
		  if(res.data.role === 'admin'){
			  history.push("/admin/dashboard");
		  }
		  else{
			  history.push("/user/history");
		  }
	  }
  };
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    //// console.log(email, password);

    try{
      const result = await auth.signInWithEmailAndPassword(email, password);

      const{user} = result;
      const idTokenResult = await user.getIdTokenResult();

      createOrUpdateUser(idTokenResult.token)
        .then(res => {
	        //// console.log("POST REQ LOGIN PAGE", res);
	
	        dispatch({
		        type:"LOGGED_IN_USER",
		        payload:{
		        	name: res.data.name,
			        email:res.data.email,
			        token: idTokenResult.token,
			        role: res.data.role,
			        _id: res.data._id,
		        }
	        });
	
	        roleBasedRedirect(res);
	        
        })
        .catch(error => console.log(error));

      

    }catch (error) {
      // console.log(error);
      toast.error(error.message);
    }

  };

  const googleLogin = async () => {

  	auth.signInWithPopup(googleAuthProvider)
      .then(async (result) =>{
        const {user} = result;
        const idTokenResult = await user.getIdTokenResult();
	
	      createOrUpdateUser(idTokenResult.token)
		      .then(res => {
			      // console.log("POST REQ LOGIN PAGE", res);
			
			      dispatch({
				      type:"LOGGED_IN_USER",
				      payload:{
					      name: res.data.name,
					      email:res.data.email,
					      token: idTokenResult.token,
					      role: res.data.role,
					      _id: res.data._id,
				      }
			      });
			
			      roleBasedRedirect(res);
			
		      })
		      .catch(error =>  console.log(error));
        

      })
      .catch((err)=> {
        // console.log(err);
      })
  };

  const handleEmailChange = (event) => {
    const emailValue = event.target.value;
    setEmail(emailValue);
  };

  const handlePasswordChange = (event) => {
    const passwordValue = event.target.value;
    setPassword(passwordValue);
  };

  const loginForm = () =>{
    return(
      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <input
            onChange={handleEmailChange}
            type="email"
            className="form-control"
            value={email}
            placeholder="Email"/>
        </div>

        <div className="form-group">
          <input
            onChange={handlePasswordChange}
            type="password"
            className="form-control"
            value={password}
            placeholder="Password"/>
        </div>

        <br/>
        <Button
        type="primary"
        size="large"
        onClick={handleSubmit}
        block
        className="mb-3"
        icon={<MailOutlined />}
        shape="round"
        disabled={!email || password.length < 6}>
        Login with Email/Password
        </Button>

        <Button
          type="danger"
          size="large"
          onClick={googleLogin}
          block
          className="mb-3"
          icon={<GoogleOutlined />}
          shape="round">
          Login with Google
        </Button>

        <Link to="/forgot/password" className="float-right text-danger">
          Forgot Password
        </Link>

      </form>
    );
  };

  return(
    <div className="container p-5">
      <div className="row">
        <div className="col-md-4 offset-md-3">
          <h4>Login</h4>
          {loginForm()}
        </div>
      </div>
    </div>
  );

};

export default Login;