import React, { useState,useContext } from 'react'
import {  Menu,Dropdown,Image } from 'semantic-ui-react'
import AddItem from './AddItem';
import TopSearch from './TopSearch'
import { useAuth0 } from '../react-auth0-spa'
// import {MixpanelConsumer } from 'react-mixpanel';
import UserContext from '../context/UserContext';
import Mixpanel from '../util/mix'
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

function BottomBar(){
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [activeItem,setActiveItem] = useState('');
  const handleItemClick = (e, { name }) => setActiveItem(name);
  const [name, setname] = useState('Find')
  const user = useContext(UserContext)
  const history = useHistory();
  // console.log(user)
  // const mixpanel = useContext(MixpanelConsumer)
  // const DEFAULT_REDIRECT_CALLBACK = () =>
  // window.history.replaceState({}, document.title, window.location.pathname);
  // const authHandler = (err, data) => {
  //       console.log(err, data);
  //     };
  const options = [
    { key: 'user', text: 'Account', icon: 'user' ,value:'user'},
    { key: 'settings', text: 'Settings', icon: 'settings' ,value:'settings'},
    { key: 'sign-out', text: 'Sign Out', icon: 'sign out' ,value:'logout'},
  ]

  const handleChangeList = (e, { value }) => {
    // console.log(value)
    switch (value) {
      case 'user':

        break;
      case 'settings':

        break;
      case 'logout':
        //TODO: in the future write code here to handle the proper redirect
        logout({returnTo:process.env.REACT_APP_BASE_URL})
        break;
      default:
        break;
    }
  }
  return(
    <Menu fixed='bottom' borderless={true} >
        
      
      <Menu.Menu position='right'>
      <Menu.Item
            name='TheListSpace'
        />
        
      </Menu.Menu>
    </Menu>
  )
}

export default BottomBar;
