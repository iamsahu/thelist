import React,{useContext,useState} from 'react';
import {Grid} from 'semantic-ui-react'
import ContentRight from '../components/ContentRight'
import ContentMiddleListOnly from '../components/ContentMiddleListOnly'

function ListDisplay(props){
    const userid = props.match.params.user
    const listid = props.match.params.listid
    return (
        <div id="content" className="ui">
            <Grid columns={3} >
                <Grid.Column width={3}>
                    </Grid.Column>
                <Grid.Column width={9}>
                    <ContentMiddleListOnly userid={userid} listid={listid}/>
                </Grid.Column>
                <Grid.Column width={4}>
                    <ContentRight userid={userid} listid={listid}/>
                </Grid.Column>
            </Grid>
        </div>
    )
}

export default ListDisplay;