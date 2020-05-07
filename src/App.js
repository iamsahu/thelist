import React from 'react';
import logo from './logo.svg';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

import MenuBar from './components/menu'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <MenuBar/>
      <Route exact path='/' component={Home}/>
    </Router>
  );
}

export default App;
