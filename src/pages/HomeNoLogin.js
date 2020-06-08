import React from "react";
import {
	Header,
	Container,
	Button,
	Icon,
	Grid,
	Card,
	Image,
	Responsive,
} from "semantic-ui-react";
import Home from "./Home";
import { Link } from "react-router-dom";

function HomeNoLogin() {
	return (
		<>
			<Responsive {...Responsive.onlyMobile}>
				<div>
					<br />
					<Container fluid textAlign="center">
						{/* <Image src={`${process.env.REACT_APP_BASE_URL}/clip-education.png`} wrapped size='medium'/> */}
						<Header
							as="h1"
							content="The List Space"
							style={{
								fontSize: "4em",
								fontWeight: "normal",
								marginBottom: 0,
								marginTop: "1em",
							}}
						/>
						{/* <Header
                as='h4'
                content='The coolest curations on the internet!'                
                style={{
                
                marginBottom: 0,
                marginTop:  '1em',
                }}
            /> */}
						<Header
							as="h1"
							content="Save any content in one place!"
							style={{
								fontSize: "3em",
								fontWeight: "normal",
								marginTop: "1.5em",
							}}
						/>
						<Link to="/explore">
							<Button primary size="huge">
								Get Started
								<Icon name="right arrow" />
							</Button>
						</Link>
					</Container>
					<Container fluid>
						<Grid
							columns={3}
							className="equal width center aligned "
							stackable
							style={{ marginTop: "2rem" }}
						>
							<Grid.Column width={4}>
								{/* <Card className='ui fluid card'> */}
								<Card style={{ height: "431px" }} className="ui fluid card">
									<Image
										src={`${process.env.REACT_APP_BASE_URL}/undraw_pitching_36ol_ F5DD47.png`}
										wrapped
										ui={false}
									/>
									{/* <Image src={`${process.env.REACT_APP_BASE_URL}/pablo-list-is-empty.png`} wrapped ui={false} /> */}
									<Card.Content header="Curate" />
									<Card.Content description="Curate content from all different places in one location in neat collections. Easy to find. Easy to cross reference. Easy to go back to." />
								</Card>
							</Grid.Column>
							<Grid.Column width={4}>
								<Card style={{ height: "431px" }} className="ui fluid card">
									{/* <Card style={{'height':'361px'}} className='ui fluid card'> */}
									{/* <Card className='ui fluid card'> */}
									<Image
										src={`${process.env.REACT_APP_BASE_URL}/undraw_online_connection_6778_ F5DD47.png`}
										wrapped
										ui={false}
									/>
									{/* <Image src={`${process.env.REACT_APP_BASE_URL}/pablo-sign-up.png`} wrapped ui={false} /> */}
									<Card.Content header="Share" />
									<Card.Content description="Fun and easy way to share your curation easily with others. Track how useful they are finding your curation." />
								</Card>
							</Grid.Column>
							<Grid.Column width={4}>
								{/* <Card style={{'height':'431px'}} className='ui fluid card'> */}
								<Card style={{ height: "431px" }} className="ui fluid card">
									<Image
										src={`${process.env.REACT_APP_BASE_URL}/undraw_location_search_bqps_ F5DD47.png`}
										wrapped
										ui={false}
									/>
									{/* <Image src={`${process.env.REACT_APP_BASE_URL}/pablo-searching.png`} wrapped ui={false} /> */}
									<Card.Content header="Discover" />
									<Card.Content description="Discover fascinating curations by your fellow curators on things you like or find something all new. You can find all types of curation here!" />
								</Card>
							</Grid.Column>
						</Grid>
					</Container>
					{/* <Divider/>
        <Home/> */}
				</div>
			</Responsive>
			<Responsive minWidth={Responsive.onlyTablet.minWidth}>
				<div className="scroll">
					<br />
					<Container fluid textAlign="center">
						{/* <Image src={`${process.env.REACT_APP_BASE_URL}/clip-education.png`} wrapped size='medium'/> */}
						<Header
							as="h1"
							content="The List Space"
							style={{
								fontSize: "4em",
								fontWeight: "normal",
								marginBottom: 0,
								marginTop: "1em",
							}}
						/>
						{/* <Header
                as='h4'
                content='The coolest curations on the internet!'                
                style={{
                
                marginBottom: 0,
                marginTop:  '1em',
                }}
            /> */}
						<Header
							as="h1"
							content="Save any content in one place!"
							style={{
								fontSize: "3em",
								fontWeight: "normal",
								marginTop: "1.5em",
							}}
						/>
						<Link to="/explore">
							<Button primary size="huge">
								Get Started
								<Icon name="right arrow" />
							</Button>
						</Link>
					</Container>
					<Container fluid>
						<Grid
							columns={3}
							className="equal width center aligned "
							stackable
							style={{ marginTop: "2rem" }}
						>
							<Grid.Column width={4}>
								{/* <Card className='ui fluid card'> */}
								<Card style={{ height: "431px" }} className="ui fluid card">
									<Image
										src={`${process.env.REACT_APP_BASE_URL}/undraw_pitching_36ol_ F5DD47.png`}
										wrapped
										ui={false}
									/>
									{/* <Image src={`${process.env.REACT_APP_BASE_URL}/pablo-list-is-empty.png`} wrapped ui={false} /> */}
									<Card.Content header="Curate" />
									<Card.Content description="Curate content from all different places in one location in neat collections. Easy to find. Easy to cross reference. Easy to go back to." />
								</Card>
							</Grid.Column>
							<Grid.Column width={4}>
								<Card style={{ height: "431px" }} className="ui fluid card">
									{/* <Card style={{'height':'361px'}} className='ui fluid card'> */}
									{/* <Card className='ui fluid card'> */}
									<Image
										src={`${process.env.REACT_APP_BASE_URL}/undraw_online_connection_6778_ F5DD47.png`}
										wrapped
										ui={false}
									/>
									{/* <Image src={`${process.env.REACT_APP_BASE_URL}/pablo-sign-up.png`} wrapped ui={false} /> */}
									<Card.Content header="Share" />
									<Card.Content description="Fun and easy way to share your curation easily with others. Track how useful they are finding your curation." />
								</Card>
							</Grid.Column>
							<Grid.Column width={4}>
								{/* <Card style={{'height':'431px'}} className='ui fluid card'> */}
								<Card style={{ height: "431px" }} className="ui fluid card">
									<Image
										src={`${process.env.REACT_APP_BASE_URL}/undraw_location_search_bqps_ F5DD47.png`}
										wrapped
										ui={false}
									/>
									{/* <Image src={`${process.env.REACT_APP_BASE_URL}/pablo-searching.png`} wrapped ui={false} /> */}
									<Card.Content header="Discover" />
									<Card.Content description="Discover fascinating curations by your fellow curators on things you like or find something all new. You can find all types of curation here!" />
								</Card>
							</Grid.Column>
						</Grid>
					</Container>
					{/* <Divider/>
        <Home/> */}
				</div>
			</Responsive>
		</>
	);
}

export default HomeNoLogin;
