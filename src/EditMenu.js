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
import {
    isBrowser,
    isMobile
} from "react-device-detect";
import swal from 'sweetalert';


function EditMenu(props) {
    const [open, setOpen] = React.useState(false)
    const [nameError, setNameError] = React.useState(false)
    const [whoBoughtError, setWhoBoughtError] = React.useState(false)
    const [whoPaysError, setWhoPaysError] = React.useState(false)
    const [proportionsError, setProportionsError] = React.useState(false)
    const [priceError, setPriceError] = React.useState(false)
    const [quantityError, setQuantityError] = React.useState(false)

    function checkAllFields() {
        setNameError(0);
        setWhoBoughtError(0);
        setWhoPaysError(0);
        setProportionsError(0);
        setPriceError(0);
        setQuantityError(0);

        let isOk = true;
        // check name
        if (props.inputNameText === '') {
            setNameError(1);
            isOk = 0;
        }
        // check whoBought
        if (props.whoBought === null) {
            setWhoBoughtError(1);
            isOk = 0;
        }
        // check whoPays
        if (props.whoPays.length == 0) {
            setWhoPaysError(1);
            isOk = 0;
        }
        // // check proportions
        // for (let prop of props.proportions) {
        //     console.log('prop = ', prop)
        //     if (prop < 1) {
        //         setProportionsError(1);
        //         isOk = 0;
        //     }
        // }

        // check price
        let parsedPrice = parseInt(props.inputPriceText)
        if (isNaN(parsedPrice)) {
            setPriceError(1);
            isOk = 0;
        } else {
            if (parsedPrice <= 0 || parsedPrice > 1000000) {
                setPriceError(1);
                isOk = 0;
            }
        }

        // check quantity
        let parsedQuantity = parseInt(props.inputQuantityText)
        if (isNaN(parsedQuantity)) {
            setQuantityError(1);
            isOk = 0;
        } else {
            if (parsedQuantity <= 0 || parsedQuantity > 1000) {
                setQuantityError(1);
                isOk = 0;
            }
        }

        return isOk
    }
    return (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => {
                props.fillDataToEdit(props.productId);
                setOpen(true);
            }}
            open={open}
            size={isBrowser ? 'small' : ''}
            trigger={<Button

                fluid={isBrowser}

            >
                <p className='textAlignCenter '>
                    <Icon name='pencil' />
                    {isMobile && ' Редактировать'}
                </p>

            </Button>}
        >
            <Modal.Header>Редактировать продукт</Modal.Header>
            <Modal.Content>
                <p className='tableFont'>
                    <p className='tableHeaderFont'>
                        <b>Название </b>
                    </p>
                    <Input fluid
                        className='placeholderCentering textAlignCenter'
                        placeholder='Название продукта'
                        error={nameError}
                        onChange={(e) => props.handleInputChange('Name', e)}
                        value={props.inputNameText}
                    />
                </p>

                <p className='tableFont'>
                    <p className='tableHeaderFont'>
                        <b>Кто купил</b>
                    </p>
                    <Dropdown
                        className='placeholderCentering textAlignCenter'
                        placeholder='Кто купил'
                        error={whoBoughtError}
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
                    <p className='tableHeaderFont'>
                        <b>Кто скидывается</b>
                    </p>
                    <Dropdown
                        className='placeholderCentering textAlignCenter'
                        placeholder='Кто скидывается'
                        fluid
                        multiple
                        noResultsMessage={props.namesArray.length ? '' : 'Сначала добавьте имена'}
                        search
                        clearable
                        selection
                        error={whoPaysError}
                        options={props.getWhoPaysOptions()}
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
                                error={proportionsError}
                                //namesArray={props.whoPays}
                                proportions={props.proportions}
                                handleProportionsChange={props.handleProportionsChange}
                                reduceProportions={props.reduceProportions}
                                getNameById={props.getNameById}
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
                                    type="number"
                                    error={priceError}
                                    onChange={(e) => props.handleInputChange('Price', e)}
                                    value={props.inputPriceText}
                                />
                            </Grid.Column>

                            <Grid.Column>
                                <Input
                                    fluid
                                    //width={1}
                                    type="number"
                                    label='Кол-во'
                                    //style={{ paddingTop: '10px', }}
                                    placeholder=''
                                    error={quantityError}
                                    onChange={(e) => props.handleInputChange('Quantity', e)}
                                    value={props.inputQuantityText}
                                />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </p>



            </Modal.Content>
            <Modal.Actions>
                <Button
                    negative
                    onClick={() => {
                        swal({
                            title: "Внимание",
                            text: "Вы действительно хотите удалить продукт?",
                            icon: "warning",
                            buttons: true,
                            dangerMode: true,
                        })
                            .then((willDelete) => {
                                if (willDelete) {
                                    props.resetInputs();
                                    props.removeRow(props.productId)
                                    setOpen(false);
                                } else {
                                    // safe
                                }
                            });
                    }}

                    style={{ float: "left" }}

                >
                    Удалить</Button>
                <Button onClick={() => {
                    props.resetInputs();
                    setOpen(false);
                }}
                >
                    Отмена</Button>
                <Button onClick={() => {
                    if (checkAllFields()) {
                        props.handleChangeRow(
                            props.productId,
                            props.inputNameText,
                            props.whoBought,
                            //props.whoPays,
                            parseInt(props.inputPriceText),
                            parseInt(props.inputQuantityText),
                            props.proportions
                        );
                        props.resetInputs();
                        setOpen(false);
                    }
                }
                } positive>
                    Сохранить
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default EditMenu