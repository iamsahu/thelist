import React, { useState, useContext } from 'react'
import { Input, Menu } from 'semantic-ui-react'
import AddItem from './AddItem';
import AddList from './AddList';
import TopSearch from './TopSearch'
import { useAuth0 } from '../react-auth0-spa'
import {MixpanelConsumer } from 'react-mixpanel';

function MenuBar(){
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [activeItem,setActiveItem] = useState('');
  const handleItemClick = (e, { name }) => setActiveItem(name);
  // const mixpanel = useContext(MixpanelConsumer)
  // const DEFAULT_REDIRECT_CALLBACK = () =>
  // window.history.replaceState({}, document.title, window.location.pathname);
  // const authHandler = (err, data) => {
  //       console.log(err, data);
  //     };

  return(
    
      <Menu fixed='top' borderless={true} >
        <Menu.Item
            name='TheListSpace'
            active={activeItem === 'curato'}
            onClick={handleItemClick}
        />
        
        <Menu.Item>
          <TopSearch />          
        </Menu.Item>
        
        <Menu.Menu position='right'>
          {!isAuthenticated && (
            <MixpanelConsumer>
            {mixpanel=>  <Menu.Item position='right'
                name='Login'
                active={activeItem === 'Login'}
                onClick={()=>{
                  console.log("Login")
                  mixpanel.track("Login", {"genre": "hip-hop", "duration in seconds": 42});
                  loginWithRedirect({})
                }}
              />
          }
            </MixpanelConsumer>
          )}
          {isAuthenticated && (
            <>
            <Menu.Item position='right' fitted='vertically'>
            <AddItem/>
            </Menu.Item>
            <MixpanelConsumer>
              {mixpanel=>
              <Menu.Item position='right'
              name='Logout'
              active={activeItem === 'Logout'}
              onClick={()=>{
                console.log("Logout")
                mixpanel.track('logout')
                logout()
              }}
              />
              }
            </MixpanelConsumer>
            </>
          )}
        </Menu.Menu>
      </Menu>
    
  )
}

export default MenuBar;