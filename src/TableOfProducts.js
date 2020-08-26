import React, { Component } from 'react';
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
import EditMenu from './EditMenu';

class TableOfProducts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputNameText: '',
            // inputWhoBoughtText: '',
            // inputWhoPaysText: '',
            inputPriceText: '',
            inputQuantityText: '1'
        }
        this.handleWhoBoughtChange = this.handleWhoBoughtChange.bind(this)
        this.handleWhoPaysChange = this.handleWhoPaysChange.bind(this)
    }

    resetInputs() {
        this.setState({
            inputNameText: '',
            // inputWhoBoughtText: '',
            // inputWhoPaysText: '',
            whoBought: null,
            whoPays: null,
            inputPriceText: '',
            inputQuantityText: '1'
        });
    }

    handleInputChange(name, e) {

        const target = e.target;
        const value = target.value;
        this.setState({
            ['input' + name + 'Text']: value,
        });
    }

    handleWhoBoughtChange(e, { name, value }) {
        //console.log(e);
        this.setState({
            whoBought: value,
        });
    }

    handleWhoPaysChange(e, { name, value }) {
        //console.log(e);
        this.setState({
            whoPays: value,
        });
    }


    render() {
        return (
            <div>
                {/* <Segment basic> */}
                <div>
                    <Table selectable celled singleLine >

                        {/* <Table.Header
                            color='green'
                            hidden
                        >
                            <Table.Row>
                                <Table.HeaderCell width={4}>
                                    <p className='tableHeaderFont'>
                                        Продукт
                                        </p>
                                </Table.HeaderCell>
                                <Table.HeaderCell width={4}>
                                    <p className='tableHeaderFont'>
                                        Кому вернуть
                                        </p>
                                </Table.HeaderCell>
                                <Table.HeaderCell width={5}>
                                    <p className='tableHeaderFont'>
                                        Кто вернёт
                                        </p>
                                </Table.HeaderCell>
                                <Table.HeaderCell width={2}>
                                    <p className='tableHeaderFont'>
                                        Цена
                                        </p>
                                </Table.HeaderCell>
                                <Table.HeaderCell width={1}>
                                    <p className='tableHeaderFont'>

                                    </p>
                                </Table.HeaderCell>
                            </Table.Row>
                        </Table.Header> */}

                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>
                                    <p className='tableFont'>
                                        <Input fluid
                                            className='placeholderCentering textAlignCenter'
                                            placeholder='Название продукта'
                                            //label='Название продукта'
                                            onChange={(e) => this.handleInputChange('Name', e)}
                                            value={this.state.inputNameText}

                                        />
                                    </p>
                                </Table.Cell>

                                <Table.Cell>
                                    <p className='tableFont'>
                                        <Dropdown
                                            className='placeholderCentering textAlignCenter'
                                            placeholder='Кто купил'
                                            fluid
                                            noResultsMessage={this.props.namesArray.length ? '' : 'Сначала добавьте имена'}
                                            search
                                            selection
                                            options={this.props.namesArray}
                                            onChange={this.handleWhoBoughtChange}
                                            value={this.state.whoBought}

                                        />
                                        {/* <Input fluid
                                            className='placeholderCentering textAlignCenter'
                                            placeholder='Кто купил'
                                            //label='Кто купил'
                                            onChange={(e) => this.handleInputChange('WhoBought', e)}
                                            value={this.state.inputWhoBoughtText}
                                        /> */}
                                    </p>
                                </Table.Cell>

                                <Table.Cell>
                                    <p className='tableFont'>
                                        <Dropdown
                                            className='placeholderCentering textAlignCenter'
                                            placeholder='Кто скидывается'
                                            fluid
                                            multiple
                                            noResultsMessage={this.props.namesArray.length ? '' : 'Сначала добавьте имена'}
                                            search
                                            selection
                                            options={this.props.namesArray}
                                            onChange={this.handleWhoPaysChange}
                                            value={this.state.whoPays}

                                        />


                                        <Transition.Group
                                            //as={List}
                                            duration={200}
                                            divided
                                            size='huge'
                                            verticalAlign='middle'
                                        >
                                            {this.state.inputQuantityText != '1' &&
                                                <Button
                                                    fluid
                                                    //width={1}
                                                    style={{ marginTop: '10px', }}
                                                >
                                                    Пропорции
                                        </Button>
                                            }
                                        </Transition.Group>
                                        {/* <Input fluid
                                            className='placeholderCentering textAlignCenter'
                                            placeholder='Кто скидывается'
                                            //label='Кто скидывается'
                                            onChange={(e) => this.handleInputChange('WhoPays', e)}
                                            value={this.state.inputWhoPaysText}
                                        /> */}
                                    </p>
                                </Table.Cell>

                                <Table.Cell>
                                    <p className='tableFont'>
                                        <Input fluid
                                            label={{ basic: true, content: '₽' }}
                                            labelPosition='right'
                                            placeholder='Цена'
                                            //label='Цена'
                                            onChange={(e) => this.handleInputChange('Price', e)}
                                            value={this.state.inputPriceText}
                                        />


                                        <Input
                                            fluid
                                            //width={1}
                                            //type="number" тогда число не вмещается 
                                            label='Кол-во'
                                            style={{ paddingTop: '10px', }}
                                            placeholder=''
                                            onChange={(e) => this.handleInputChange('Quantity', e)}
                                            value={this.state.inputQuantityText}
                                        />



                                        {/* {row.price} ₽ */}
                                    </p>
                                </Table.Cell>

                                <Table.Cell width={1}>
                                    <p className='tableFont'>
                                        <Button fluid onClick={() => {
                                            this.props.handleAddRow(this.state.inputNameText,
                                                this.state.whoBought,
                                                this.state.whoPays,
                                                parseInt(this.state.inputPriceText),
                                                parseInt(this.state.inputQuantityText)); this.resetInputs();
                                        }}>
                                            <p className='textAlignCenter '>
                                                <Icon name='add' />
                                            </p>

                                        </Button>
                                    </p>
                                </Table.Cell>

                            </Table.Row>

                            {this.props.tableData.map((row) => {
                                return (
                                    <Table.Row>
                                        <Table.Cell width={4}>
                                            <p className='tableFont'>
                                                {row.product}
                                            </p>
                                        </Table.Cell>

                                        <Table.Cell width={4}>
                                            <p className='tableFont'>
                                                {row.whoBought}
                                            </p>
                                        </Table.Cell>

                                        <Table.Cell width={4}>
                                            <p className='tableFont'>
                                                {row.whoPays.map((e, i) => ((i == row.whoPays.length - 1) ? e : e + ', '))}
                                            </p>
                                        </Table.Cell>

                                        <Table.Cell width={2}>
                                            <p className='tableFont'>
                                                {`${row.quantity} × ${row.price} = ${row.quantity * row.price}`} ₽
                                                </p>
                                        </Table.Cell>

                                        <Table.Cell width={1}>
                                            <p className='tableFont'>
                                                <EditMenu />
                                            </p>
                                        </Table.Cell>

                                    </Table.Row>
                                )
                            })}




                        </Table.Body>
                    </Table>

                </div>
                {/* </Segment> */}
            </div>
        );
    }
}

export default TableOfProducts;