import React from 'react';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {Avatar, Badge} from 'antd';

let apiURL;

if(process.env.NODE_ENV === 'production'){
	apiURL = `/api`;
}
else{
	apiURL = process.env.REACT_APP_API;
}

const FileUpload = ({values, setValues, setLoading}) => {
	
	const {user} = useSelector(state => ({...state}));
	
	const fileUploadAndResize = (e) => {
		//console.log(e.target.files);
		
		//resize
		let files = e.target.files;
		let allUploadedFiles = values.images;
		
		//console.log("IMAGE UPLOAD", files, allUploadedFiles);
		
		if(files){
			setLoading(true);
			for(let i = 0 ; i < files.length; i++){
				Resizer.imageFileResizer(files[i],
					720,
					720,
					'JPEG',
					100,
					0,
					(uri)=>{
					// uri
					// console.log(uri);
						axios.post(`${apiURL}/uploadimages`, {image: uri}, {
							headers: {
								authToken: user ? user.token : "",
							}
						})
							.then(res => {
								console.log("IMAGE UPLOAD RESPONSE DATA", res);
								setLoading(false);
								allUploadedFiles.push(res.data);

								setValues({...values, images: allUploadedFiles});
							})
							.catch(err => {
								setLoading(false);
								console.log("IMAGE UPLOAD ERROR", err);
							});
				}, "base64");
			}
		}
		//send to server to upload to cloudinary
		//set url received from server to parent component state
	};
	
	const handleImageRemove = (public_id) =>{
		setLoading(true);
		console.log("Remove Image", public_id);
		axios.post(`${apiURL}/removeimage`, {public_id}, {
			headers: {
				authToken: user ? user.token : "",
			}
		}).then(res =>{
				setLoading(false);
				const {images} = values;
				
				let filteredImages = images.filter(image => {
					return image.public_id !== public_id;
				});
				setValues({...values, images: filteredImages})
			})
			.catch(err=>{
				setLoading(false);
				console.log(err);
			});
		
	};
	
  return (
    <>
	    <div className="row">
		    {
		    	values.images && values.images.map(image =>
						<Badge count="X" key={image.public_id} onClick={() => handleImageRemove(image.public_id)} style={{cursor:"pointer"}}>
							<Avatar shape="square" src={image.url} size={100} className="ml-3" />
						</Badge>
			    )
		    }
	    </div>
	    <div className="row">
		    <label className="btn btn-primary btn-raised mt-2">Choose File
			    <input hidden type="file" multiple accept="images/*" onChange={fileUploadAndResize} />
		    </label>
	    </div>
    </>
  );
};

export default FileUpload;