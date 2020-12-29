import React, { useState, useEffect } from 'react';

import {
    Button,
    Container,
    Grid,
    Header,
    Icon,
    Input,
    Image,
    Modal,
    Form,
    TextArea,
    Item,
    Label,
    Menu,
    Checkbox,
    Segment,
    Step,
    Table,
    GridColumn,
} from "semantic-ui-react";

function ChooseNames(props) {

    const [open, setOpen] = React.useState(false)

    // Нажатие enter для закрытия окна конфликтует с нажатием для перевода строки
    
    // useEffect(() => {
    //     const listener = event => {
    //       if (event.code === "Enter" || event.code === "NumpadEnter") {
    //         console.log("Enter key was pressed. Run your function.");
    //         setOpen(false);
    //       }
    //     };
    //     document.addEventListener("keydown", listener);
    //     return () => {
    //       document.removeEventListener("keydown", listener);
    //     };
    //   }, []);
    

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size={'mini'}
            trigger={<Button primary fluid>
                Список людей
            </Button>}
        >
            <Modal.Header>Список людей</Modal.Header>
            <Modal.Content>

                <p className='tableFont'>
                    <Form
                        value='sm'
                    >
                        <TextArea
                            //fluid
                            //width={2}
                            //style={{ minHeight: '203px' }}
                            placeholder={'Серго\r\nДаня\r\nВаня\r\n\r\nили\r\n\r\n\Серго, Даня, Ваня'}
                            onChange={props.handleNamesChange}
                            className='textAlignCenter'
                            value={props.namesText}
                            rows={7}
                        />
                    </Form>
                </p>

            </Modal.Content>
            <Modal.Actions className='textAlignCenter'>
                {/* <Button onClick={() => setOpen(false)}>Cancel</Button> */}
                <Button onClick={() => setOpen(false)} positive>
                    ОК
        </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default ChooseNames