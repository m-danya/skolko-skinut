import React from 'react'
import {
    Button,
    Container,
    Grid,
    Header,
    Icon,
    Input,
    Image,
    Modal,
    Item,
    Label,
    Menu,
    Checkbox,
    Segment,
    Step,
    Table,
    GridColumn,
} from "semantic-ui-react";
import {
    isBrowser,
    isMobile
} from "react-device-detect";

function EditMenu() {
    const [open, setOpen] = React.useState(false)

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button 
            
            fluid = {isBrowser}
            
            >
                <p className='textAlignCenter '>
                    <Icon name='pencil' />
                    {isMobile && ' Редактировать'}
                </p>

            </Button>}
        >
            <Modal.Header>Upload image</Modal.Header>
            <Modal.Content>
                    <p className='tableFont'>
                        <Input fluid
                            className='placeholderCentering textAlignCenter'
                            placeholder='Название продукта'
                        //label='Название продукта'
                        //onChange={(e) => this.handleInputChange('Name', e)}
                        //value={this.state.inputNameText}

                        />
                    </p>
                                    и другие поля (уже заполненные офк)
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => setOpen(false)} positive>
                    Ok
        </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default EditMenu