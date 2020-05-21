import React,{useContext,useState} from 'react';
import {Card,Image} from 'semantic-ui-react'
import {DoesUserExists} from '../util/graphqlExecutor'
import UserContext from '../context/UserContext';

function ProfileCard(){
    const user = useContext(UserContext)
    const [userProfile, setuserProfile] = useState('https://react.semantic-ui.com/images/avatar/large/steve.jpg')
    const [username, setusername] = useState("Mojo Jojo")
    const [description, setdescription] = useState('A master procrastinator with a penchant for reading all that is unecessary!')

    const loadUser= ()=>{
        DoesUserExists({user_id:user.curator_id})
        .then((response)=>{
            // console.log(response)
            if(typeof(response)!=='undefined'){
                if(typeof(response.user[0])!=='undefined'){
                    // console.log(response.user[0]['image_link'])
                    setuserProfile(response.user[0]['image_link'])
                    setusername(response.user[0]['username'])
                }
            }
        })
    }

    loadUser()
    return(
        <>
            <div>
            <Card fluid>
                <Card.Content>
                    <Image
                    floated='right'
                    size='mini'
                    src={userProfile}
                    />
                    <Card.Header>{username}</Card.Header>
                    <Card.Meta>Friends of Elliot</Card.Meta>
                    <Card.Description>
                    {description}
                    </Card.Description>
                </Card.Content>
            </Card>
            </div>
        </>
    )
}

export default ProfileCard