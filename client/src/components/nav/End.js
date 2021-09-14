import React from 'react';
import {GithubOutlined, LinkedinFilled} from '@ant-design/icons';

const End = () => {
  return (
	  <div className="footer">
		  <div className="text-center">
			  <div className="h4" style={{color:'#C3073F'}}>
				  Created By Ojasv
				  <a style={{color:'inherit'}} href="https://github.com/ojasvkumar" target="_blank"> <GithubOutlined className="h5" /> </a>
				  <a style={{color:'inherit'}} href="https://www.linkedin.com/in/ojasvkumar/" target="_blank"> <LinkedinFilled className="h5" /> </a>
			  </div>
			  <div style={{color:'#C5C6C7', fontSize:'12px', marginTop:'-10px'}}>
				  Demo MERN Stack E-commerce project.
			  </div>
		  </div>
	  </div>
  );
};

export default End;


