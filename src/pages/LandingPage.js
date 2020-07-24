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
import Explore3 from "../components/Explore3";

function LandingPage() {
	return (
		<>
			<Responsive {...Responsive.onlyMobile}>
				{/* <div> */}
				<br />
				<Container fluid textAlign="center">
					{/* <Image src={`${process.env.REACT_APP_BASE_URL}/clip-education.png`} wrapped size='medium'/> */}
					<Header
						as="h1"
						content="The List Space"
						style={{
							fontSize: "2em",
							fontWeight: "normal",
							marginBottom: 0,
							marginTop: "0.2em",
						}}
					/>
					<Header
						as="h1"
						// content="Save any content in one place!"
						content="Find and curate stuff from the internet!"
						// content="Fastest way to create and share listicles!"
						style={{
							fontSize: "1em",
							fontWeight: "normal",
							marginTop: "0.3em",
							// margin: "7px 0px 14px 0px",
							color: "#7a7a7a",
						}}
					/>
					<Link to="/explore">
						<Button
							primary
							size="huge"
							style={{
								"border-radius": "36px",
								"box-shadow": "0px 13px 20px 0px rgba(0, 0, 0, 0.13)",
							}}
						>
							Get Started
							<Icon name="right arrow" />
						</Button>
					</Link>
				</Container>
				{/* <Container fluid>
						<Grid
							columns={3}
							className="equal width center aligned "
							stackable
							style={{ marginTop: "2rem" }}
						>
							<Grid.Column width={4}>
								
								<Card style={{ height: "431px" }} className="ui fluid card">
									<Image
										src={`${process.env.REACT_APP_BASE_URL}/undraw_pitching_36ol_ F5DD47.png`}
										wrapped
										ui={false}
									/>
									
									<Card.Content header="Curate" />
									<Card.Content description="Curate content from all different places in one location in neat collections. Easy to find. Easy to cross reference. Easy to go back to." />
								</Card>
							</Grid.Column>
							<Grid.Column width={4}>
								<Card style={{ height: "431px" }} className="ui fluid card">
									
									<Image
										src={`${process.env.REACT_APP_BASE_URL}/undraw_online_connection_6778_ F5DD47.png`}
										wrapped
										ui={false}
									/>
									
									<Card.Content header="Share" />
									<Card.Content description="Fun and easy way to share your curation easily with others. Track how useful they are finding your curation." />
								</Card>
							</Grid.Column>
							<Grid.Column width={4}>
								
								<Card style={{ height: "431px" }} className="ui fluid card">
									<Image
										src={`${process.env.REACT_APP_BASE_URL}/undraw_location_search_bqps_ F5DD47.png`}
										wrapped
										ui={false}
									/>
									<Card.Content header="Discover" />
									<Card.Content description="Discover fascinating curations by your fellow curators on things you like or find something all new. You can find all types of curation here!" />
								</Card>
							</Grid.Column>
						</Grid>
					</Container> */}
				{/* <Container style={{ marginTop: "2rem" }} fluid> */}
				<Header textAlign="center" as="h1">
					Explore!
				</Header>
				<Explore3 />
				{/* </Container> */}
				{/* <Divider/>
        <Home/> */}
				{/* </div> */}
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
								marginTop: "0.5em",
							}}
						/>

						<Header
							as="h3"
							// content="Save any content in one place!"
							content="Find and curate stuff from the internet!"
							style={{
								fontSize: "2em",
								fontWeight: "normal",
								// marginTop: "0.3em",
								margin: "7px 0px 14px 0px",
								color: "#7a7a7a",
							}}
						/>
						<Link to="/explore">
							<Button
								primary
								size="huge"
								style={{
									"border-radius": "36px",
									"box-shadow": "0px 13px 20px 0px rgba(0, 0, 0, 0.13)",
								}}
							>
								Get Started
								<Icon name="right arrow" />
							</Button>
						</Link>
					</Container>
					{/* <Container fluid>
						<Grid
							columns={3}
							className="equal width center aligned "
							stackable
							style={{ marginTop: "2rem" }}
						>
							<Grid.Column width={4}>
								
								<Card style={{ height: "431px" }} className="ui fluid card">
									<Image
										src={`${process.env.REACT_APP_BASE_URL}/undraw_pitching_36ol_ F5DD47.png`}
										wrapped
										ui={false}
									/>
									
									<Card.Content header="Curate" />
									<Card.Content description="Curate content from all different places in one location in neat collections. Easy to find. Easy to cross reference. Easy to go back to." />
								</Card>
							</Grid.Column>
							<Grid.Column width={4}>
								<Card style={{ height: "431px" }} className="ui fluid card">
									
									<Image
										src={`${process.env.REACT_APP_BASE_URL}/undraw_online_connection_6778_ F5DD47.png`}
										wrapped
										ui={false}
									/>
									
									<Card.Content header="Share" />
									<Card.Content description="Fun and easy way to share your curation easily with others. Track how useful they are finding your curation." />
								</Card>
							</Grid.Column>
							<Grid.Column width={4}>
								
								<Card style={{ height: "431px" }} className="ui fluid card">
									<Image
										src={`${process.env.REACT_APP_BASE_URL}/undraw_location_search_bqps_ F5DD47.png`}
										wrapped
										ui={false}
									/>
									
									<Card.Content header="Discover" />
									<Card.Content description="Discover fascinating curations by your fellow curators on things you like or find something all new. You can find all types of curation here!" />
								</Card>
							</Grid.Column>
						</Grid>
					</Container> */}

					<Container style={{ marginTop: "2rem" }}>
						<Header textAlign="center" as="h1">
							Explore!
						</Header>
						<Explore3 />
					</Container>
					{/* <Divider/>
        <Home/> */}
				</div>
			</Responsive>
		</>
	);
}

export default LandingPage;
