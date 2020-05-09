import React, { useState,createRef } from 'react'
import { Input, Menu, Segment,Sticky,Button } from 'semantic-ui-react'

import AddItem from './AddItem';

function MenuBar(){
    const contextRef = createRef()
    const [activeItem,setActiveItem] = useState('');
    const handleItemClick = (e, { name }) => setActiveItem(name);

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
              <Menu.Item
                name='Login'
                active={activeItem === 'Login'}
                onClick={handleItemClick}
              />
          </Menu.Menu>
        </Menu>
        
        </div>
    )
}

export default MenuBar;