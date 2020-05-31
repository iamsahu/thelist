import React, { useState,useContext } from 'react'
import {  Menu,Dropdown,Image, Button } from 'semantic-ui-react'
import AddItem from './AddItem';
import TopSearch from './TopSearch'
import { useAuth0 } from '../react-auth0-spa'
// import {MixpanelConsumer } from 'react-mixpanel';
import UserContext from '../context/UserContext';
import Mixpanel from '../util/mix'
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

function MenuBar(){
  const { user,isAuthenticated,loading, loginWithRedirect, logout } = useAuth0();
  const [activeItem,setActiveItem] = useState('');
  const handleItemClick = (e, { name }) => setActiveItem(name);
  const [name, setname] = useState('Find')
  const [image, setimage] = useState(1)
  
  const history = useHistory();
  
  const options = [
    { key: 'user', text: 'Account', icon: 'user' ,value:'user'},
    { key: 'settings', text: 'Settings', icon: 'settings' ,value:'settings'},
    { key: 'sign-out', text: 'Sign Out', icon: 'sign out' ,value:'logout'},
  ]

  const handleChangeList = (e, { value }) => {
    // console.log(value)
    switch (value) {
      case 'user':
        history.push('/'+user['sub'].split('|')[1])
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
    <Menu fixed='top' borderless={true} inverted stackable>
      {/* <Link to={`/`}> */}
        <Menu.Item
            name='TheListSpace'
            active={activeItem === 'curato'}
            onClick={()=>history.push('/')}
        />
      {/* </Link> */}
      <Menu.Item>
        <TopSearch />          
      </Menu.Item>
      
      <Menu.Menu position='right'>
        {!isAuthenticated && (
          <>
          <Menu.Item position='right'>
          <Button>
            <Link to='/explore'> Explore</Link>
          </Button>
          </Menu.Item>
          <Menu.Item position='right'
            name='Login'
            active={activeItem === 'Login'}
            onClick={()=>{
              console.log("Login")
              Mixpanel.track("Login", {"genre": "hip-hop", "duration in seconds": 42});
              loginWithRedirect({})
            }}
          />
          </>
        )}
        {isAuthenticated &&!loading&& (
          <>
          <Menu.Item position='right' fitted='vertically'>
            <Button>
              <Link to='/explore'> Explore</Link>
            </Button>
            </Menu.Item>
            <Menu.Item position='right' fitted='vertically'>
            <AddItem/>
          </Menu.Item>
            <Menu.Item position='right'>
              <Dropdown
                fluid
                // trigger={<><Image avatar src='https://react.semantic-ui.com/images/avatar/large/steve.jpg'/>{user.name}</>}
                trigger={<><Image avatar src={user.picture}/>{user.name}</>}
                options={options}
                pointing='top right'
                icon={null}
                onChange={handleChangeList}
              />
            </Menu.Item>
          </>
        )}
      </Menu.Menu>
    </Menu>
  )
}

export default MenuBar;
