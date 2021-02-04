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

function ChooseProportions(props) {

    const [open, setOpen] = React.useState(false)

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            size={'tiny'}
            trigger={<Button
                fluid
                basic={props.error}
                color={props.error ? 'red' : 'white'}
                width={1}
                style={{ marginTop: '10px', }}
            >
                Пропорции: {
                    (props.proportions.every(v => v.part === props.proportions[0].part)
                        ?
                        'поровну'
                        :
                        (props.proportions.map((e, i) => ((i == props.proportions.length - 1) ?
                            e.part
                            :
                            e.part + ' : ')))
                    )
                }
            </Button>}
        >
            <Modal.Header>Пропорции</Modal.Header>
            <Modal.Content>

                <p className='tableFont' style={{ textAlign: 'center' }}>
                    <Form
                        value='sm'
                    >
                        {props.proportions.length ?

                            (
                                <Table basic='very' celled collapsing className='ui center image' >
                                    {/* <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell>Имя</Table.HeaderCell>
                                            <Table.HeaderCell>Доля</Table.HeaderCell>
                                            <Table.HeaderCell textAlign='right'></Table.HeaderCell>

                                        </Table.Row>
                                    </Table.Header> */}

                                    <Table.Body>



                                        {(props.proportions.map((p) => {

                                            return (<Table.Row>
                                                <Table.Cell textAlign='center'>
                                                    <Header as='h4' image>
                                                        <Header.Content>
                                                            {props.getNameById(p.id)}
                                                        </Header.Content>
                                                    </Header>
                                                </Table.Cell>
                                                <Table.Cell textAlign='center'>
                                                    {p.part}
                                                </Table.Cell>
                                                <Table.Cell textAlign='right'>
                                                    <Button.Group icon>
                                                        <Button
                                                            onClick={() => { props.handleProportionsChange(p.id, -1) }}
                                                        >
                                                            <Icon name='minus' />
                                                        </Button>
                                                        <Button
                                                            onClick={() => { props.handleProportionsChange(p.id, 1) }}
                                                        >
                                                            <Icon name='plus' />
                                                        </Button>

                                                    </Button.Group>

                                                </Table.Cell>
                                            </Table.Row>
                                            )
                                        }))}


                                    </Table.Body>
                                </Table>
                            ) : <div>Сначала укажите, кто скидывается</div>}

                        {/* <TextArea
                            //fluid
                            //width={2}
                            //style={{ minHeight: '203px' }}
                            placeholder={'Серго\r\nДаня\r\nВаня\r\n\r\nили\r\n\r\n\Серго, Даня, Ваня'}
                            onChange={props.handleNamesChange}
                            className='textAlignCenter'
                            value={props.namesText}
                            rows={7}
                        /> */}
                    </Form>
                </p>

            </Modal.Content>
            <Modal.Actions className='textAlignCenter'>
                {/* <Button onClick={() => setOpen(false)}>Cancel</Button> */}
                <Button onClick={() => {
                    props.reduceProportions();
                    setOpen(false);
                }
                }
                    positive>
                    OK
        </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default ChooseProportions