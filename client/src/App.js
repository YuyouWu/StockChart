import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store';

import AppNavbar from './components/AppNavbar'
import MainScreen from './components/MainScreen'
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';
import LandingPage from './components/LandingPage/LandingPage';
import ResetPasswordWithToken from './components/ResetPasswordWithToken';
import ForgetPassword from './components/ForgetPassword';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'antd/dist/antd.css';
import 'semantic-ui-css/semantic.min.css';
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <div>
            <Router>
              <div>
                <AppNavbar />
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/portfolio" component={MainScreen} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/forget_password" component={ForgetPassword} />
                <Route exact path="/reset_password/:token" component={ResetPasswordWithToken} />
              </div>
            </Router>
          </div>
        </div>
      </Provider>
    );
  }
}

export default App;
