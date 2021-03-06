import React, {useState} from 'react';
import {Modal} from 'antd';
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';
import {StarOutlined} from '@ant-design/icons';
import {useHistory, useParams} from 'react-router-dom';

const RatingModel = ({children}) => {
	
	const {user} = useSelector(state => ({...state}));
	const history = useHistory();
	const {slug} = useParams();
	const [modalVisible, setModalVisible] = useState(false);
	
	const handleModal = () => {
		if(user && user.token){
			setModalVisible(true);
		}
		else{
			history.push({
				pathname:'/login',
				state: { from : `/product/${slug}` }
			})
		}
	}
	
  return (
    <>
      <div onClick={handleModal} >
	      <StarOutlined className="text-danger" /> <br />
	      {user ? "Leave rating" : "Login to leave rating"}
      </div>
	    <Modal
	      title="Leave your Rating"
	      centered
	      visible={modalVisible}
	      onOk={() => {
	      	setModalVisible(false);
	        toast("Thanks for your valuable feedback")
	      }}
	      onCancel={() => {
	      	setModalVisible(false);
	      }}
	    >
		    {children}
	    </Modal>
    </>
  );
};

export default RatingModel;