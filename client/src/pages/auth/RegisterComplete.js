import React, {useState, useEffect} from "react";
import {auth} from '../../firebase';
import {toast} from "react-toastify";
import {useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {createOrUpdateUser} from "../../functions/auth";

const RegisterComplete = () => {

  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {user} = useSelector((state) => ({...state}));
  const dispatch = useDispatch();

  useEffect(()=>{
    if(user && user.token){
      history.push("/");
    }
  }, [user, history]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try{
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );
      if(result.user.emailVerified){
        window.localStorage.removeItem('emailForRegister');

        let user = auth.currentUser;
        await user.updatePassword(password);
			
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
			
			      history.push("/");
			
		      })
		      .catch(error =>  console.log(error));
        
        
        history.push("/");
      }
    }catch (e) {
      // console.log(e);
      toast.error(e.message)
    }



  };

  const handleChange = (event) => {
    const value = event.target.value;
    setPassword(value);
  };

  useEffect(()=>{
    setEmail(window.localStorage.getItem('emailForRegister'));
  }, []);

  const completeRegisterationForm = () =>{
    return(
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="form-control"
          value={email}
          disabled/>

        <input
          type="password"
          className="form-control"
          value={password}
          placeholder="Password"
          onChange={handleChange}/>
        <br/>
        <button type="submit" className="btn btn-raised">Complete Registration</button>
      </form>
    );
  };

  return(
    <div className="container p-5">
      <div className="row">
        <div className="col-md-4 offset-md-3">
          <h4>Register Complete</h4>
          {completeRegisterationForm()}
        </div>
      </div>
    </div>
  );

};

export default RegisterComplete;