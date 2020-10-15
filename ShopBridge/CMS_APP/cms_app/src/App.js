import React from 'react';
import logo from './logo.svg';
import { BrowserRouter as Router, Route} from "react-router-dom";
import { Redirect } from 'react-router';
import './App.css';
import ItemInfo from './ItemInfo'
import ShopBridage from './ShopBridage'

function App() {
  return (
    <div className="App">
      <Router>
        <Route exact path="/" render={() => (
            <Redirect to="/shop-bridge"/>
        )}/>
        <Route path="/shop-bridge" component={ShopBridage} />
        <Route path="/item-info" component={ItemInfo} />
      </Router>
    </div>
  );
}

export default App;
