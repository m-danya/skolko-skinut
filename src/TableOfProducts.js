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
            inputWhoBoughtText: '',
            inputWhoPaysText: '',
            inputPriceText: '',
        }
    }

    handleInputChange(name, e) {

        const target = e.target;
        const value = target.value;
        this.setState({
            ['input' + name + 'Text']: value,
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

                                        />
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
                                        <Button fluid onClick={() => this.props.handleAddRow(this.state.inputNameText,
                                            this.state.inputWhoBoughtText,
                                            this.state.inputWhoPaysText,
                                            parseInt(this.state.inputPriceText),
                                            parseInt(this.state.inputQuantityText))}>
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
                                                {row.whoPays}
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