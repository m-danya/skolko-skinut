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
import ChooseProportions from './ChooseProportions';

function MobileAddMenu(props) {
    const [open, setOpen] = React.useState(false)

    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button
                color='green'
                fluid>
                <p className='textAlignCenter '
                >
                    {/* <Icon name='add' color='green' /> */}
                    Добавить продукт
                </p>

            </Button>}
        >
            <Modal.Header>Добавить продукт</Modal.Header>
            <Modal.Content>
                <p className='tableFont'>
                    <Input fluid
                        className='placeholderCentering textAlignCenter'
                        placeholder='Название продукта'
                        onChange={(e) => props.handleInputChange('Name', e)}
                        value={props.inputNameText}

                    />
                </p>
                <p className='tableFont'>
                    <Dropdown
                        className='placeholderCentering textAlignCenter'
                        placeholder='Кто купил'
                        fluid
                        noResultsMessage={props.namesArray.length ? '' : 'Сначала добавьте имена'}
                        search
                        selection
                        options={props.namesArray}
                        onChange={props.handleWhoBoughtChange}
                        value={props.whoBought}

                    />
                    {/* <Input fluid
                                            className='placeholderCentering textAlignCenter'
                                            placeholder='Кто купил'
                                            //label='Кто купил'
                                            onChange={(e) => props.handleInputChange('WhoBought', e)}
                                            value={props.inputWhoBoughtText}
                                        /> */}
                </p>
                <p className='tableFont'>
                    <Dropdown
                        className='placeholderCentering textAlignCenter'
                        placeholder='Кто скидывается'
                        fluid
                        multiple
                        noResultsMessage={props.namesArray.length ? '' : 'Сначала добавьте имена'}
                        search
                        selection
                        options={props.namesArray}
                        onChange={props.handleWhoPaysChange}
                        value={props.whoPays}

                    />


                    <Transition.Group
                        //as={List}
                        duration={200}
                        divided
                        size='huge'
                        verticalAlign='middle'
                    >
                        {//props.inputQuantityText != '1' && props.inputQuantityText != '' &&
                            <ChooseProportions
                                namesArray={props.whoPays}
                                proportions={props.proportions}
                                handleProportionsChange={props.handleProportionsChange}
                                reduceProportions={props.reduceProportions}
                            />
                        }
                    </Transition.Group>
                    {/* <Input fluid
                                            className='placeholderCentering textAlignCenter'
                                            placeholder='Кто скидывается'
                                            //label='Кто скидывается'
                                            onChange={(e) => props.handleInputChange('WhoPays', e)}
                                            value={props.inputWhoPaysText}
                                        /> */}
                </p>
                <p className='tableFont'>

                    <Grid divided='vertically'>
                        <Grid.Row columns={2}>
                            <Grid.Column>
                                <Input fluid
                                    label={{ basic: true, content: '₽' }}
                                    labelPosition='right'
                                    placeholder='Цена'
                                    //label='Цена'
                                    onChange={(e) => props.handleInputChange('Price', e)}
                                    value={props.inputPriceText}
                                />
                            </Grid.Column>

                            <Grid.Column>
                                <Input
                                    fluid
                                    //width={1}
                                    type="number" // вроде вмещается число с мобильника
                                    label='Кол-во'
                                    //style={{ paddingTop: '10px', }}
                                    placeholder=''
                                    onChange={(e) => props.handleInputChange('Quantity', e)}
                                    value={props.inputQuantityText}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>




                    {/* {row.price} ₽ */}
                </p>



            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => {
                    props.resetInputs();

                    setOpen(false);
                }}
                >
                    Отмена</Button>
                <Button onClick={() => {
                    props.handleAddRow(
                        props.inputNameText,
                        props.whoBought,
                        props.whoPays,
                        parseInt(props.inputPriceText),
                        parseInt(props.inputQuantityText),
                        props.proportions
                    );
                    props.resetInputs();

                    setOpen(false);
                }} positive>
                    Добавить
        </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default MobileAddMenu