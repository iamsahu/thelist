import React from 'react';
import logo from './logo.svg';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { UserProvider } from './context/UserContext'
import MenuBar from './components/menu'
import Home from './pages/Home'

function App() {
  const user = { name: 'Tania', loggedIn: true ,curator_id:'26b4e98c-b5dc-4810-97b9-909ddc74c4f0',loggedin_user_id:'26b4e98c-b5dc-4810-97b9-909ddc74c4f0'}

  return (
    <UserProvider value={user}>
      <Router>
        <MenuBar/>
        <Route exact path='/' component={Home}/>
      </Router>
    </UserProvider>
  );
}

export default App;
