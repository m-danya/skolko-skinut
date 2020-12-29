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
import MobileAddMenu from './MobileAddMenu';
import ChooseProportions from './ChooseProportions';
import {
    isBrowser,
    isMobile
} from "react-device-detect";

class TableOfProducts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputNameText: '',
            // inputWhoBoughtText: '',
            // inputWhoPaysText: '',
            inputPriceText: '',
            inputQuantityText: '1',
            proportions: [],
            whoBought: null,
            whoPays: [],
        }
        this.handleWhoBoughtChange = this.handleWhoBoughtChange.bind(this)
        this.handleWhoPaysChange = this.handleWhoPaysChange.bind(this)
        this.handleProportionsChange = this.handleProportionsChange.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.resetInputs = this.resetInputs.bind(this)
        this.reduceProportions = this.reduceProportions.bind(this)
    }

    resetInputs() {
        this.setState({
            inputNameText: '',
            // inputWhoBoughtText: '',
            // inputWhoPaysText: '',
            whoBought: null,
            whoPays: [],
            inputPriceText: '',
            inputQuantityText: '1',
            proportions: [],
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
            proportions: new Array(value.length).fill(1),
        });
    }

    handleProportionsChange(name, value) {
        let proportions_new = this.state.proportions.slice()
        proportions_new[name] += value
        if (proportions_new[name] < 1) proportions_new[name] = 1
        this.setState({
            proportions: proportions_new,
        })

    }

    gcd(a, b) {
        if (b > a) {
            let t = b
            b = a
            a = t
        }
        // a >= b
        let ans = 1
        for (let i = 1; i <= b; i += 1) {
            if (a % i == 0 && b % i == 0) {
                ans = i
            }
        }
        return ans
    }

    reduceProportions() {
        // find gcd and divide by it every number
        let g = this.state.proportions[0];
        for (let i of this.state.proportions) {
            g = this.gcd(g, i)
        }

        let proportions_new = this.state.proportions.slice()
        for (let n in proportions_new) {
            proportions_new[n] = proportions_new[n] / g
        }
        this.setState({
            proportions: proportions_new,
        })

    }



    render() {
        return (
            <div>
                {/* <Segment basic> */}
                <div>
                    {isMobile &&

                        <MobileAddMenu
                            namesArray={this.props.namesArray}
                            whoBought={this.props.whoBought}
                            handleWhoPaysChange={this.handleWhoPaysChange}
                            whoPays={this.state.whoPays}
                            proportions={this.state.proportions}
                            handleProportionsChange={this.handleProportionsChange}
                            handleInputChange={this.handleInputChange}
                            inputPriceText={this.state.inputPriceText}
                            inputQuantityText={this.state.inputQuantityText}
                            handleAddRow={this.props.handleAddRow}
                            resetInputs={this.resetInputs}
                            reduceProportions={this.reduceProportions}
                        />
                    }
                    <Table
                        // selectable 
                         celled
                        //basic
                    >

                        <Table.Body>
                            {isBrowser &&

                                <Table.Row>
                                    <Table.Cell width={4}>
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

                                    <Table.Cell width={4}>
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

                                    <Table.Cell width={4}>
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
                                                {//this.state.inputQuantityText != '1' && this.state.inputQuantityText != '' &&
                                                    <ChooseProportions
                                                        namesArray={this.state.whoPays}
                                                        proportions={this.state.proportions}
                                                        handleProportionsChange={this.handleProportionsChange}

                                                    />
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

                                    <Table.Cell width={2}>
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
                                                this.props.handleAddRow(
                                                    this.state.inputNameText,
                                                    this.state.whoBought,
                                                    this.state.whoPays,
                                                    parseInt(this.state.inputPriceText),
                                                    parseInt(this.state.inputQuantityText),
                                                    this.state.proportions
                                                );
                                                this.resetInputs();
                                            }}>
                                                <p className='textAlignCenter '>
                                                    <Icon name='add' />
                                                </p>

                                            </Button>
                                        </p>
                                    </Table.Cell>

                                </Table.Row>

                            }

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
                                                {row.whoPays.map((e, i) => ((i == row.whoPays.length - 1) ? e : e + ', '))}<br />
                                                <text className='tableFontProportions' style={{ paddingTop: '0', marginInlineStart: 0 }}>
                                                    {
                                                        row.proportions.length == 1 ? '' : (row.proportions.every(v => v === row.proportions[0])
                                                            ?
                                                            '(поровну)'
                                                            :
                                                            (row.proportions.map((e, i) => ((i == row.proportions.length - 1) ? e : e + ' : ')))
                                                        )
                                                    }
                                                </text>
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