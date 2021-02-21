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
    Dropdown,
    Transition,
    Item,
    Label,
    Menu,
    Checkbox,
    Segment,
    Step,
    Table,
    GridColumn,
} from "semantic-ui-react";


function EditProjectName(props) {
    const [open, setOpen] = React.useState(false)
    const [nameError, setNameError] = React.useState(false)
    function checkAllFields() {
        setNameError(0);
        let isOk = true;
        // check name
        if (props.projectnameInput === '') {
            setNameError(1);
            isOk = 0;
        }

        return isOk
    }

    return (
        <Modal
            size='tiny'
            onClose={() => setOpen(false)}
            onOpen={() => {
                setOpen(true);
                
            }}
            open={open}
            trigger={
                <Icon name="pencil alternate" style={{ fontSize: "0.5em" }} className="clickable"
                onClick={() => {
                    props.handleProjectNameInputChange(props.projectname);
                }} />
            }
        >
            <Modal.Header>Редактировать название проекта</Modal.Header>
            <Modal.Content>
                <p className='tableFont'>
                    <Input fluid
                        className='placeholderCentering textAlignCenter'
                        placeholder='Название проекта'
                        error={nameError}
                        onChange={(e) => props.handleProjectNameInputChange(e.target.value)}
                        value={props.projectnameInput}
                    />
                </p>

            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => {
                    setOpen(false);
                    props.handleProjectNameInputChange("")
                }}
                >
                    Отмена</Button>
                <Button onClick={() => {
                    if (checkAllFields()) {
                        props.handleProjectNameChange(props.projectnameInput)
                        setOpen(false);
                    }
                }} positive>
                    Сохранить
        </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default EditProjectName