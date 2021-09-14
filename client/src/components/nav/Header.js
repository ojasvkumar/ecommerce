import React, {useState} from 'react'
import { Menu, Badge } from 'antd';
import { UserAddOutlined, ShoppingOutlined, ShoppingCartOutlined, AppstoreOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import firebase from "firebase";
import {Link, useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import Search from '../forms/Search';
import logo from "../../images/logo_final.png";

const { SubMenu, Item } = Menu;

const Header = () => {

  const history = useHistory();
  const dispatch = useDispatch();
  const [current, setCurrent] = useState("home");
  const {user, cart} = useSelector((state)=> ({...state}));

  const handleClick = (event) => {
    const selected = event.key;
    setCurrent(selected);
  };

  const logout = () => {
    firebase.auth().signOut();
    dispatch({
      type:"LOGOUT",
      payload:null
    });

    history.push("/login");
  };

  return(
    <Menu onClick={handleClick} selectedKeys={current} mode="horizontal">
      <Item key="home" icon={<img src={logo} alt="" style={{height:'20px', width:'25px'}} />}>
        <Link to="/" style={{marginLeft:'-10px'}}>Buzz</Link>
      </Item>
	
	    <Item key="shop" icon={<ShoppingOutlined />}>
		    <Link to="/shop">Shop</Link>
	    </Item>
	
	    <Item key="cart" icon={<ShoppingCartOutlined />}>
		    <Link to="/cart">
			    <Badge count={cart.length} offset={[9,0]}>
				    Cart
			    </Badge>
		    </Link>
	    </Item>
	
	    <Item key="logo" icon={<img src={logo} alt="" style={{height:'30px', width:'38px'}} />} style={{marginLeft:'450px', marginRight:'auto'}}>
		    <Link to="/"></Link>
	    </Item>
	    
      {user && (
        <SubMenu key="SubMenu"
                 icon={<UserOutlined />}
                 title={user.email && user.email.split('@')[0]}
                 className="float-right">
	        {user && user.role === 'subscriber' && <Item key="setting:2"><Link to="/user/history">Dashboard</Link></Item>}
	        {user && user.role === 'admin' && <Item key="setting:2"><Link to="/admin/dashboard">Dashboard</Link></Item>}
          <Item icon={<LogoutOutlined />} onClick={logout}>Logout</Item>
        </SubMenu>
      )}

      {!user && (
        <Item key="register" icon={<UserAddOutlined />} className="float-right">
          <Link to="/register">Register</Link>
        </Item>
      )}

      {!user && (
        <Item key="login" icon={<UserOutlined />} className="float-right">
          <Link to="/login">Login</Link>
        </Item>
      )}
      
      <span className="float-right p-1">
	      <Search />
      </span>
      
    </Menu>
  );

};

export default Header;