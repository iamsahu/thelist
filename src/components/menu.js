import React, { useState } from 'react'
import { Input, Menu } from 'semantic-ui-react'
import AddItem from './AddItem';
import { useAuth0 } from '../react-auth0-spa'

function MenuBar(){
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
    const [activeItem,setActiveItem] = useState('');
    const handleItemClick = (e, { name }) => setActiveItem(name);
    // const DEFAULT_REDIRECT_CALLBACK = () =>
    // window.history.replaceState({}, document.title, window.location.pathname);
    // const authHandler = (err, data) => {
    //       console.log(err, data);
    //     };

    return(
        <div>
            <Menu pointing attached='top'>
            <Menu.Item
                name='Curato'
                active={activeItem === 'curato'}
                onClick={handleItemClick}
            />
            <Menu.Menu position='left'>
            <Menu.Item>
              <Input icon='search' placeholder='Search...' />
            </Menu.Item>
          </Menu.Menu>
          <Menu.Menu position='right'>
            <AddItem/>
              {/* <Menu.Item> */}
              {!isAuthenticated && (
                <Menu.Item
                name='Login'
                active={activeItem === 'Login'}
                onClick={() => loginWithRedirect({})}
                />
              )}

              {isAuthenticated && (
                <Menu.Item
                name='Logout'
                active={activeItem === 'Logout'}
                onClick={() => logout()}
                />
              )}
          </Menu.Menu>
        </Menu>
        
        </div>
    )
}

export default MenuBar;