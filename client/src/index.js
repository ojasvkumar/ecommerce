import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import {browserHistory} from 'react-router';
import 'antd/dist/antd.css';
import rootReducer from "./reducers/index";

import {createStore} from "redux";
import {Provider} from "react-redux";
import {composeWithDevTools} from "redux-devtools-extension";
import End from "./components/nav/End";
import logo from "./images/logo_final.png";
import {LoadingOutlined} from "@ant-design/icons";


const store = createStore(rootReducer, composeWithDevTools());


ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter history={browserHistory}>
	      <Suspense fallback={<div className="h2 text-center" style={{marginTop:'50vh'}}>
		      <img src={logo} alt="" style={{height:'30px', width:'38px'}} />
		      BUZZ EC<LoadingOutlined />MMERCE
	      </div>}>
		      <App />
		      <End />
	      </Suspense>
      </BrowserRouter>
    </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
