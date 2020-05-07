import React from 'react'
import {Modal,Button,Header,Image,Icon} from 'semantic-ui-react'

function AddItem(){
    return(
        <>
        <Modal trigger={<Button>Add Item</Button>}>
            <Modal.Header>Add Item</Modal.Header>
            <Modal.Content image scrolling>
            <Image size='medium' src='https://react.semantic-ui.com/images/wireframe/image.png' wrapped />
            <Modal.Description>
                <Header>Modal Header</Header>
                <p>
                This is an example of expanded content that will cause the modal's
                dimmer to scroll
                </p>
            </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
            <Button primary>
                Submit
            </Button>
            </Modal.Actions>
        </Modal>
        </>
    )
}

export default AddItem;