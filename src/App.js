import React,{useState} from 'react';
import {BrowserRouter as Router,Route, Switch} from 'react-router-dom';
// import 'semantic-ui-forest-themes/semantic.lumen.min.css'
import 'semantic-ui-css/semantic.min.css';//readable
import './App.css';
import 'react-interactions/dist/main.css';
import mixpanel from 'mixpanel-browser';
import { MixpanelProvider } from 'react-mixpanel';

import { UserProvider } from './context/UserContext'
import {ContentProvider} from './context/ContentContext';
import MenuBar from './components/menu'
import BottomBar from './components/BottomBar'
import Home2 from './pages/Home2'
import Home from './pages/Home'
import HomeNoLogin from './pages/HomeNoLogin'
import Curator from './pages/Curator'
import Curator2 from './pages/Curator2'
import SearchResults from './pages/SearchResults'
import DataEntry from './pages/DataEntry'
// import SignUpComplete from './pages/SignUpComplete'
// import ListDisplay from './pages/ListDisplay'
// import TagDisplay from './pages/TagDisplay'
import history from "./util/history";
import { useAuth0 } from './react-auth0-spa'
import { toast } from 'react-toastify';
import {DoesUserExists,InsertUser} from './util/graphqlExecutor'
import {Container} from 'semantic-ui-react'
import Mixpanel from './util/mix'

import ReactGA from 'react-ga';

toast.configure();
function App() {
  
  // mixpanel.init("4521493075a15cf75d66df3581c5410e");
  ReactGA.initialize('UA-166934260-1');
  history.listen((location) => {
      ReactGA.set({ page: location.pathname });
      ReactGA.pageview(location.pathname)
    }
  );

//   history.listen((location) => {
//     if(location.pathname.includes('/user')) {
//       let rootURL = location.pathname.split('/')[1]
//       let userPage = location.pathname.split('/')[3]
 
//       let pageHit = `/${rootURL}/${userPage}`
//       ReactGA.pageview(pageHit)
//     } else {
//       ReactGA.set({ page: location.pathname });
//       ReactGA.pageview(location.pathname)
//     }
//  });

  const userC = {curator_id:'',loggedin_user_id:'',image_link:''}
  const [content,contentChange] = useState({currentTag:'None',contentType:'lists',lists:{},tags:{},currentList:'',currentTagID:'',currentListID:''})//Passing a function so that the consumer can change the content
  const { loading,isAuthenticated,user, loginWithRedirect, logout } = useAuth0();
  const [userExists,SetExists] = useState(false)
  const [loadingT, setloading] = useState(true)
  const [userCheckStatus, setuserCheckStatus] = useState(true)
  // mixpanel.identify(userC.loggedin_user_id)
  // mixpanel.track("Video play", {"genre": "hip-hop", "duration in seconds": 42});

  const callback = list => {
    list.getEntries().forEach(entry => {
      ReactGA.timing({
        category: "Load Performace",
        variable: 'Server Latency',
        value: entry.responseStart - entry.requestStart 
      })
    })
  }

  var observer = new PerformanceObserver(callback);
  observer.observe({entryTypes: ['navigation'] })

  const checkUser = (user_id)=>{
    DoesUserExists({user_id:user_id}).then((response)=>{
      if(response.user.length>0){
        // console.log("more")
        SetExists(true)
        // mixpanel.identify(userC.loggedin_user_id)
      }else{
        SetExists(false)
        if(!userExists)
        {InsertUser({id:user_id,image_link:user.picture,username:user.name}).then((response)=>{
          console.log(response)
        }).catch((error)=>{
          // console.log(error)
        })}
      }
      setloading(false)
    })
    // console.log("UserCheck")
  }
  
  if(!loading&&userCheckStatus){
    if(typeof(user)!=='undefined'){
      // console.log(user)
      var userID = user['sub'].split('|')[1]
      userC['curator_id'] = userID
      userC['loggedin_user_id'] = userID
      userC['name'] =user['name']
      userC['nickname']=user['nickname']
      userC['image_link']=user['picture']
      // setuserCheckStatus(false)
      checkUser(userID)
      Mixpanel.identify(userID)
      // var props = {user:userID}
      // console.log("here")
    }
  }
  // console.log(userID)
  // console.log("App")
  
  return (
    // <MixpanelProvider mixpanel={mixpanel}>
      <UserProvider value={userC}>
        <ContentProvider value={[content,contentChange]}>
            <Router history={history}>
              <MenuBar user={user}/>
              <div className="novscroll">
              <Container style={{ marginTop: '3em',height: '85vh' }} fluid>
                <Switch>
                  <Route exact path='/dataentry' component={DataEntry}/>
                  <Route exact path='/explore' component={Home2}/>
                  <Route exact path='/search' component={SearchResults}/>
                  <Route exact path='/:user/:contenttype/:contentid' component={Curator2}/>
                  {/* <Route exact path='/:user/tags/:tagid' component={Curator2}/> */}
                  <Route exact path='/:user/:contenttype' component={Curator2}/>
                  <Route exact path='/:user' component={Curator2}/>
                  {
                    (isAuthenticated&&!(loading)&&!loadingT)?
                    <Route
                      path='/'
                      render={(props) => <Curator2 user={userC['curator_id']} isAuthed={true} />}/>:
                    <Route exact path='/' component={HomeNoLogin}/> 
                  }
                </Switch>
              </Container>
              </div>
            </Router>
        </ContentProvider>
      </UserProvider>
    // </MixpanelProvider>
  );
}

export default App;
