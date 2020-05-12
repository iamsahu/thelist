import React, { useState } from 'react'
import { Input, Menu } from 'semantic-ui-react'
import AddItem from './AddItem';
import AddList from './AddList';
import TopSearch from './TopSearch'
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
            {/* <Menu.Menu position='left'>
            <Menu.Item>
              <TopSearch/>
              {/* <Input icon='search' placeholder='Search...' /> */}
            {/* </Menu.Item>
          </Menu.Menu> */} 
          {/* <Menu.Menu position='right'>
          {isAuthenticated && (
            
              )}
          </Menu.Menu> */}
          <Menu.Menu position='right'>
          
              {!isAuthenticated && (
                <Menu.Item
                name='Login'
                active={activeItem === 'Login'}
                onClick={() => loginWithRedirect({})}
                />
              )}

              
                {isAuthenticated && (
                  <>
                 
                  <AddItem/>
                      <AddList/>
                    
                      
                <Menu.Item
                name='Logout'
                active={activeItem === 'Logout'}
                onClick={() => logout()}
                />
                </>
              )}
              
          </Menu.Menu>
        </Menu>
        
        </div>
    )
}

export default MenuBar;