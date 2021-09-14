import React, {useState, useEffect} from "react";
import {auth} from '../../firebase';
import {useHistory} from "react-router-dom";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";

const Register = () => {

  const [email, setEmail] = useState("");

  const history = useHistory();
  const {user} = useSelector((state) => ({...state}));

  useEffect(()=>{
    if(user && user.token){
      history.push("/");
    }
  }, [user, history]);

  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    // conosle.log( process.env.REACT_APP_REGISTER_REDIRECT_URL);
    const actionCodeSettings = {
      url: process.env.REACT_APP_REGISTER_REDIRECT_URL,
      handleCodeInApp: true,
    };

    await auth.sendSignInLinkToEmail(email, actionCodeSettings);
    toast.success(`Email is sent to ${email}. Click the link to complete registration.`);

    window.localStorage.setItem('emailForRegister', email);
    setEmail("");
  }
  const handleChange = (event) => {
    const value = event.target.value;
    setEmail(value);
  };

  const registerForm = () =>{
    return(
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="email"
          className="form-control"
          value={email}
          placeholder="Email"/>

          <br/>
         <button type="submit" className="btn btn-raised"> Register </button>
      </form>
    );
  };

  return(
    <div className="container p-5">
      <div className="row">
        <div className="col-md-4 offset-md-3">
          <h4>Register</h4>
          {registerForm()}
        </div>
      </div>
    </div>
  );

};

export default Register;