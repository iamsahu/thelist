import React,{useState} from 'react'
import {List,Divider} from 'semantic-ui-react'
import {GetAllUsers} from '../util/graphqlExecutor'

import ProfileListItem from './ProfileListItem';

function PopularProfile(){
    const [loading, setloading] = useState(true)
    const [allusers, setallusers] = useState(null)

    const loadData = ()=>{
        GetAllUsers().then((response)=>{
            setallusers(response)
            setloading(false)
        })
    }

    loadData()

    return(
        <>
        {
            (loading)?(<div>loading</div>):
            (
                <List>
                {
                    allusers.user.map(theone=>(<ProfileListItem image_link={theone.image_link} id={theone.id} username={theone.username} description={theone.description}/>))
                }
                </List>
            )
        }
        </>
    )
}

export default PopularProfile;