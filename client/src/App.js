import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import AppNavbar from './components/AppNavbar'
import TickerList from './components/TickerLists'
import Register from './components/Register';

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AppNavbar />
        <div className="container">
          <Router>
            <div>
              <Route exact path="/portfolio" component={TickerList} />
              <Route exact path="/register" component={Register} />
            </div>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
