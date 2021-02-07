import React, { useState, useEffect, createRef } from 'react';
import { isBrowser, isMobile } from 'react-device-detect';

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


class ChooseNames extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            nameError: false,
            open: false,
            inputNameValue: '',
            inputRef: createRef(),
        };
        this.enter = this.enter.bind(this);
        this.listener = this.listener.bind(this);

        document.addEventListener("keydown", this.listener);
    }

    listener(event) {
        if (event.code === "Enter" || event.code === "NumpadEnter") {
            console.log("Enter key was pressed. Run your function.");
            this.enter();
        }
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.listener);
    }

    setNameError(val) {
        this.setState({
            nameError: val
        })
    }

    setOpen(val) {
        this.setState({
            open: val
        })
        if (!val) {
            this.setState({
                nameError: false,
                inputNameValue: ''
            })
        }
    }

    enter() {
        if (this.state.inputRef.current) {
            this.state.inputRef.current.focus();
        }
        let ok = true;
        // check for error
        this.setNameError(0);
        if (this.state.inputNameValue == '') {
            ok = false;
        }
        if (this.props.namesArray.includes(this.state.inputNameValue)) {
            ok = false;
        }
        if (ok) {
            this.props.handleAddName(this.state.inputNameValue)
            this.setState({
                inputNameValue: '',
                nameError: false,
            });
        } else {
            this.setState({
                nameError: true,
            });
        }
    }

    render() {
        return (
            <Modal
                onClose={() => this.setOpen(false)}
                onOpen={() => this.setOpen(true)}
                open={this.state.open}
                size={'small'}
                trigger={

                    <Button
                        //primary
                        color='orange'
                        centered
                        fluid={isMobile}
                        width={isMobile ? "100%" : "300px"}
                    >
                        <p className='textAlignCenter '>
                            {this.props.namesArray.length
                                ?
                                "Список людей"
                                :
                                "Заполнить список людей"
                            }
                        </p>
                    </Button>


                }
            >
                <Modal.Header>Список людей</Modal.Header>
                <Modal.Content>
                    {this.props.namesIds.map(e => {
                        return (
                            <Label
                                size='big'
                                style={{
                                    margin: '3px',
                                }}
                            >
                                {/* <Icon name='user circle' /> */}
                                {e.name}
                                <Icon
                                    name='delete'
                                    onClick={() => {
                                        this.props.handleRemoveName(e.name)
                                    }}
                                />
                            </Label>
                        )
                    })}
                    {this.props.namesIds.length ? <br /> : ''}
                    <Input
                        action={
                            {
                                icon: 'add',
                                content: 'Добавить',
                                color: 'orange',
                                onClick: this.enter,
                            }
                        }
                        error={this.state.nameError}
                        color='orange'
                        ref={this.state.inputRef}
                        style={{
                            margin: this.props.namesIds.length ? '10px 0 0 0' : '5px 0 0 0',
                        }}
                        size='large'
                        value={this.state.inputNameValue}
                        onChange={(e) => {
                            const target = e.target;
                            const value = target.value;
                            this.setState({
                                inputNameValue: value,
                            })
                        }}
                        fluid
                        placeholder='Имя'

                    />


                </Modal.Content>
                <Modal.Actions>
                    {/* <Button onClick={() => setOpen(false)}>Cancel</Button> */}
                    <Button onClick={() => this.setOpen(false)} positive
                        className='textAlignCenter'
                        style={{
                            marginLeft: "0"
                        }}
                        size='big'
                        fluid
                    >
                        Сохранить
        </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

export default ChooseNames