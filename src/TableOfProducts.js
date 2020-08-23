import React, { Component } from 'react';
import {
    Button,
    Container,
    Grid,
    Header,
    Icon,
    Image,
    Item,
    Label,
    Menu,
    Checkbox,
    Segment,
    Step,
    Table,
    GridColumn,
} from "semantic-ui-react";

class TableOfProducts extends Component {
    render() {
        return (
            <div>
                {/* <Segment basic> */}
                <div>
                    <Table selectable unstackable celled singleLine >
                        <Table.Header color='green' >
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
                        </Table.Header>

                        <Table.Body>
                            {this.props.tableData.map((row) => {
                                return (
                                    <Table.Row>
                                        <Table.Cell>
                                            <p className='tableFont'>
                                                {row.product}
                                            </p>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <p className='tableFont'>
                                                {row.whoBought}
                                            </p>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <p className='tableFont'>
                                                {row.whoAte}
                                            </p>
                                        </Table.Cell>

                                        <Table.Cell>
                                            <p className='tableFont'>
                                                {row.price} ₽
                                                </p>
                                        </Table.Cell>

                                        <Table.Cell width={1}>
                                        <p className='tableFont'>
                                            <Icon name='edit' />
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