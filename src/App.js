import React,{useState} from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom';
// import 'semantic-ui-forest-themes/semantic.yeti.min.css'
import 'semantic-ui-css/semantic.min.css';//readable
import './App.css';
import mixpanel from 'mixpanel-browser';
import { MixpanelProvider } from 'react-mixpanel';

import { UserProvider } from './context/UserContext'
import {ContentProvider} from './context/ContentContext';
import MenuBar from './components/menu'
import Home from './pages/Home'
import ListDisplay from './pages/ListDisplay'
import history from "./util/history";
import { useAuth0 } from './react-auth0-spa'
import { toast } from 'react-toastify';

toast.configure();
function App() {
  mixpanel.init("4521493075a15cf75d66df3581c5410e");
  const userC = {curator_id:'',loggedin_user_id:''}
  const [content,contentChange] = useState({currentTag:'None',contentType:'Lists',lists:{},tags:{},currentList:'',currentTagID:'',currentListID:''})//Passing a function so that the consumer can change the content
  const { loading,isAuthenticated,user, loginWithRedirect, logout } = useAuth0();
  // mixpanel.identify(userC.loggedin_user_id)
  // mixpanel.track("Video play", {"genre": "hip-hop", "duration in seconds": 42});
  if(!loading){
    // console.log(user)

    // console.log(user['sub'])
    // console.log(user['sub'].split('|')[1])
    userC['curator_id'] = user['sub'].split('|')[1]
    userC['loggedin_user_id'] = user['sub'].split('|')[1]
  }
  
  return (
    <UserProvider value={userC}>
      <ContentProvider value={[content,contentChange]}>
        <MixpanelProvider mixpanel={mixpanel}>
          <Router history={history}>
            <MenuBar/>
            
            <Route exact path='/' component={Home}/>
            <Route exact path='/lists/:user/:listid' component={ListDisplay}/>
            
          </Router>
        </MixpanelProvider>
      </ContentProvider>
    </UserProvider>
  );
}

export default App;
