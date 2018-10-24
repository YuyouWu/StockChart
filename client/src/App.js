import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store';

import AppNavbar from './components/AppNavbar'
import MainScreen from './components/MainScreen'
import Register from './components/Register';
import Login from './components/Login';
import LandingPage from './components/LandingPage/LandingPage';

import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import 'antd/dist/antd.css';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <AppNavbar />
          <div className="container">
            <Router>
              <div>
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/portfolio" component={MainScreen} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
              </div>
            </Router>
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;
