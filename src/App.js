import React from 'react';
import logo from './logo.svg';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <h1>
          Hello World!
        </h1>
      </div>
    </Router>
  );
}

export default App;
