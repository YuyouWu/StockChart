import React, { Component } from 'react';
import AppNavbar from './components/AppNavbar'
import TickerList from './components/TickerLists'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <AppNavbar />
        <div className="container">
        	<TickerList />
        </div>
      </div>
    );
  }
}

export default App;
