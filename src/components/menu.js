import React, { useState,useContext } from 'react'
import {  Menu,Dropdown,Image } from 'semantic-ui-react'
import AddItem from './AddItem';
import TopSearch from './TopSearch'
import { useAuth0 } from '../react-auth0-spa'
import {MixpanelConsumer } from 'react-mixpanel';
import UserContext from '../context/UserContext';

function MenuBar(){
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const [activeItem,setActiveItem] = useState('');
  const handleItemClick = (e, { name }) => setActiveItem(name);
  const [name, setname] = useState('Find')
  const user = useContext(UserContext)
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
        logout()
        break;
      default:
        break;
    }
  }
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
              // <Menu.Item position='right'
              // name='Logout'
              // active={activeItem === 'Logout'}
              // onClick={()=>{
              //   console.log("Logout")
              //   mixpanel.track('logout')
              //   logout()
              // }}
              // />
              // <Dropdown item text='More'>
              //   <Dropdown.Menu>
              //     <Dropdown.Item icon='edit' text='Edit Profile' />
              //     <Dropdown.Item icon='globe' text='Choose Language' />
              //     <Dropdown.Item icon='settings' text='Account Settings' />
              //   </Dropdown.Menu>
              // </Dropdown>
              <Menu.Item position='right'>
                <Dropdown
                  trigger={<span><Image avatar src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'> {user.name}</Image></span>}
                  options={options}
                  pointing='top right'
                  icon={null}
                  onChange={handleChangeList}
                />
              </Menu.Item>
              }
            </MixpanelConsumer>
            </>
          )}
        </Menu.Menu>
      </Menu>
    
  )
}

export default MenuBar;
