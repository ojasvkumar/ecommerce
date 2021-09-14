import React, {useState, useEffect} from "react";
import {useHistory} from 'react-router-dom';
import {auth} from "../../firebase";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";


const ForgotPassword = () => {

  const [email,setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const {user} = useSelector((state) => ({...state}));
  
  useEffect(()=>{
    if(user && user.token){
      history.push("/");
    }
  }, [user]);
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);


    const config = {
      url: process.env.REACT_APP_FORGOT_PASSWORD_REDIRECT_URL,
      handleCodeInApp: true,
    };

    await auth.sendPasswordResetEmail(email, config)
      .then(()=> {
        setEmail("");
        setLoading(false);
        toast.success("A Password Reset Link has been sent to your Email.");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
        console.log(error);
      })

  };


  return(
    <div className="container col-md-6 offset-md-3 p-5">
      {loading ? <h4 className="text-danger">Loading...</h4> : <h4>Forgot Password</h4>}

      <form onSubmit={handleSubmit} >
        <input type="email" onChange={(e)=> setEmail(e.target.value)} value={email} className="form-control" placeholder="Email" autoFocus/>
        <br />
        <button className="btn btn-raised" disabled={!email} >Submit</button>
      </form>

    </div>
  );

};

export default ForgotPassword;