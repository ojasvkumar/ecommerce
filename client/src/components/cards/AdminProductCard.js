import React from 'react';
import {Link} from 'react-router-dom';
import {Card} from 'antd';
import noImage from '../../images/noImage.jpg';
import {EditOutlined, DeleteOutlined} from "@ant-design/icons";

const {Meta} = Card;

const AdminProductCard = ({product, handleRemove}) => {
	
	const {title, description, images, slug} = product;
	
  return (
    <Card cover={<img src={images.length > 0 ? images[0].url : noImage} style={{height:'150px', objectFit:'contain'}} className="p-1" alt="Product" />}
      actions={
      	[<Link to={`/admin/product/${slug}`}> <EditOutlined className="text-danger"/> </Link>, <DeleteOutlined className="text-danger" onClick={() => handleRemove(slug)}/>]
      }
    >
	    <Meta title={title} description={`${description && description.substring(0, 20)}...`}/>
    </Card>
  );
};

export default AdminProductCard;