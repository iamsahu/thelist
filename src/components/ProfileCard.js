import React,{useContext,useState} from 'react';
import {Card,Image} from 'semantic-ui-react'
import {DoesUserExists} from '../util/graphqlExecutor'
import UserContext from '../context/UserContext';

function ProfileCard(){
    const user = useContext(UserContext)
    const [userProfile, setuserProfile] = useState('https://react.semantic-ui.com/images/avatar/large/steve.jpg')
    const [username, setusername] = useState("Mojo Jojo")
    const [description, setdescription] = useState('Something witty that tells how witty you are')
    const [twitterNumber,setTwitterNumber]=useState('1')

    const loadUser= ()=>{
        DoesUserExists({user_id:user.curator_id})
        .then((response)=>{
            console.log(response)
            if(typeof(response)!=='undefined'){
                if(typeof(response.user[0])!=='undefined'){
                    // console.log(response.user[0]['image_link'])
                    setuserProfile(response.user[0]['image_link'])
                    setusername(response.user[0]['username'])
                    setTwitterNumber(response.user[0]['id'])
                    if(response.user[0]['description']!==null){
                        setdescription(response.user[0]['description'])
                    }
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
                    circular
                    />
                    <Card.Header>{username}</Card.Header>
                    <Card.Meta>You are twitter user # {twitterNumber}</Card.Meta>
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