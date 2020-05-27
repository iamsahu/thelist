import React from 'react'
import {Header,Container,Button,Icon,Grid,Card, Image} from 'semantic-ui-react'
import Home from './Home'
import { Link } from 'react-router-dom';

function HomeNoLogin(){
    return(
    <div className="scroll">
        <br/>
        <Container fluid textAlign='center'>
            {/* <Image src={`${process.env.REACT_APP_BASE_URL}/clip-education.png`} wrapped size='medium'/> */}
            <Header
                as='h1'
                content='The List Space'                
                style={{
                fontSize:  '4em',
                fontWeight: 'normal',
                marginBottom: 0,
                marginTop:  '1em',
                }}
            />
            <Header
                as='h2'
                content='Curate. Share. Discover.'                
                style={{
                fontSize:  '1.7em',
                fontWeight: 'normal',
                marginTop:  '1.5em',
                }}
            />
            <Link to='/explore'>
                <Button primary size='huge'>
                    Get Started
                    <Icon name='right arrow' />
                </Button>
            </Link>
        </Container>
        <Container>
        <Grid columns={3} className='equal width center aligned container' fluid style={{marginTop: '2rem'}}> 
            <Grid.Column width={4} >
                <Card >
                    <Image src={`${process.env.REACT_APP_BASE_URL}/pablo-list-is-empty.png`} wrapped ui={false} />
                    <Card.Content header='Curate' />
                    <Card.Content description= 'Curate content from all different places in one location in neat collections. Easy to find. Easy to cross reference' />
                    
                </Card>
            </Grid.Column>
            <Grid.Column width={4}>
                <Card>
                    <Image src={`${process.env.REACT_APP_BASE_URL}/pablo-sign-up.png`} wrapped ui={false} />
                    <Card.Content header='Share' />
                    <Card.Content description= 'Fun and easy way to share your curation easily with others. Track how useful they are finding your curation.' />
                </Card>
            </Grid.Column>
            <Grid.Column width={4}>
                <Card>
                    <Image src={`${process.env.REACT_APP_BASE_URL}/pablo-searching.png`} wrapped ui={false} />
                    <Card.Content header='Discover' />
                    <Card.Content description= 'Discover fascinating curations by your fellow curators on things you like or find something all new. You can find all types of curation here!' />
                </Card>
            </Grid.Column>
        </Grid>
        </Container>
        {/* <Divider/>
        <Home/> */}
    </div>
    )
}

export default HomeNoLogin;