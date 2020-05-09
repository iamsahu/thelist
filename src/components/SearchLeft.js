import React, { useContext } from 'react';
import {Search} from 'semantic-ui-react';
import UserContext from '../context/UserContext';
import ContentContext from '../context/ContentContext';

function SearchLeft(){
    const user = useContext(UserContext);
    const contentContext = useContext(ContentContext);
    
    return(
        <div fluid>
            <Search category fluid/>
        </div>
    )
}

export default SearchLeft;