import React,{useState} from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { UserProvider } from './context/UserContext'
import {ContentProvider} from './context/ContentContext';
import MenuBar from './components/menu'
import Home from './pages/Home'
import history from "./util/history";

function App() {
  const user = { name: 'Tania', loggedIn: true ,curator_id:'26b4e98c-b5dc-4810-97b9-909ddc74c4f0',loggedin_user_id:'26b4e98c-b5dc-4810-97b9-909ddc74c4f0'}
  const [content,contentChange] = useState({currentTag:'None',contentType:'Lists',lists:{},tags:{}})//Passing a function so that the consumer can change the content


  return (
    <UserProvider value={user}>
      <ContentProvider value={[content,contentChange]}>
      <Router history={history}>
        <MenuBar/>
        <Route exact path='/' component={Home}/>
      </Router>
      </ContentProvider>
    </UserProvider>
  );
}

export default App;
