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
import swal from 'sweetalert';

const colors = [
    'red',
    'orange',
    'yellow',
    'olive',
    'green',
    'teal',
    'blue',
    'violet',
    'purple',
    'pink',
    'brown',
    'grey',
    'black',
]


class TableOfProducts extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputNameText: '',
            inputNameTextEdit: '',
            inputPriceText: '',
            inputPriceTextEdit: '',
            inputQuantityText: '1',
            inputQuantityTextEdit: '1',
            proportions: [],
            proportionsEdit: [],
            whoBought: null, 
            whoBoughtEdit: null,
            whoPaysEdit: [], 
            whoPays: [],
        }
        this.handleWhoBoughtChange = this.handleWhoBoughtChange.bind(this)
        this.handleWhoBoughtEditChange = this.handleWhoBoughtEditChange.bind(this)
        this.handleWhoPaysEditChange = this.handleWhoPaysEditChange.bind(this)
        this.handleProportionsEditChange = this.handleProportionsEditChange.bind(this)
        this.handleWhoPaysChange = this.handleWhoPaysChange.bind(this)
        this.handleProportionsChange = this.handleProportionsChange.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.handleInputEditChange = this.handleInputEditChange.bind(this)
        this.resetInputs = this.resetInputs.bind(this)
        this.resetInputsEdit = this.resetInputsEdit.bind(this)
        this.reduceProportions = this.reduceProportions.bind(this)
        this.reduceProportionsEdit = this.reduceProportionsEdit.bind(this)
        this.getWhoPaysOptions = this.getWhoPaysOptions.bind(this)
        this.fillDataToEdit = this.fillDataToEdit.bind(this)
    }

    checkAllFields() {
        // for adding
        this.setState({
            nameError: false,
            whoBoughtError: false,
            whoPaysError: false,
            proportionsError: false,
            priceError: false,
            quantityError: false,
        })


        let isOk = true;
        // check name
        if (this.state.inputNameText === '') {
            this.setState({
                nameError: true,
            });
            isOk = 0;
        }
        // check whoBought
        if (this.state.whoBought === null) {
            this.setState({
                whoBoughtError: true,
            });
            isOk = 0;
        }
        // check whoPays
        if (this.state.whoPays.length == 0) {
            this.setState({
                whoPaysError: true,
            });
            isOk = 0;
        }

        // check price
        let parsedPrice = parseInt(this.state.inputPriceText)
        if (isNaN(parsedPrice)) {
            this.setState({
                priceError: true,
            });
            isOk = 0;
        } else {
            if (parsedPrice <= 0 || parsedPrice > 1000000) {
                this.setState({
                    priceError: true,
                });
                isOk = 0;
            }
        }

        // check quantity
        let parsedQuantity = parseInt(this.state.inputQuantityText)
        if (isNaN(parsedQuantity)) {
            this.setState({
                quantityError: true,
            });
            isOk = 0;
        } else {
            if (parsedQuantity <= 0 || parsedQuantity > 1000) {
                this.setState({
                    quantityError: true,
                });
                isOk = 0;
            }
        }

        return isOk

    }

    resetInputs() {
        this.setState({
            inputNameText: '',
            // inputWhoBoughtText: '',
            // inputWhoPaysText: '',
            whoBought: null, // мы обнуляем input-ы
            whoPays: [], // мы обнуляем input-ы
            //whoBoughtId: null,
            inputPriceText: '',
            inputQuantityText: '1',
            proportions: [],
        });
    }

    resetInputsEdit() {
        this.setState({
            inputNameTextEdit: '',
            // inputWhoBoughtText: '',
            // inputWhoPaysText: '',
            whoBoughtEdit: null, // мы обнуляем input-ы
            whoPaysEdit: [], // мы обнуляем input-ы
            //whoBoughtId: null,
            inputPriceTextEdit: '',
            inputQuantityTextEdit: '1',
            proportionsEdit: [],
        });
    }

    fillDataToEdit(id) {
        //console.log('fillDataToEdit(', id, ')')
        let index = this.props.getTableItemIndexByProductId(id)
        if (index == -1) {
            swal("Ошибка", "Кто-то удалил продукт, который вы хотели отредактировать!", "error");
            return
        }
        let whoPaysGenerated = new Array(this.props.tableData[index].proportions.length)
        for (let i in this.props.tableData[index].proportions) {
            whoPaysGenerated[i] = this.props.tableData[index].proportions[i].id
            //console.log(this.props.tableData[index].proportions[i])
        }
        this.setState({
            inputNameTextEdit: this.props.tableData[index].name.slice(),
            whoBoughtEdit: this.props.tableData[index].whoBoughtId,
            whoPaysEdit: whoPaysGenerated.slice(), //this.props.tableData[index].whoPays.slice(),
            inputPriceTextEdit: this.props.tableData[index].price,
            inputQuantityTextEdit: this.props.tableData[index].quantity,
            proportionsEdit: this.props.tableData[index].proportions.slice(),
        });
    }

    handleInputChange(name, e) {
        const target = e.target;
        const value = target.value;
        this.setState({
            ['input' + name + 'Text']: value,
        });
    }

    handleInputEditChange(name, e) {
        const target = e.target;
        const value = target.value;
        this.setState({
            ['input' + name + 'TextEdit']: value,
        });
    }

    handleWhoBoughtChange(e, { name, value }) {
        this.setState({
            whoBought: value,
        });
    }

    handleWhoBoughtEditChange(e, { name, value }) {
        this.setState({
            whoBoughtEdit: value,
        });
    }

    handleWhoPaysChange(e, { name, value }) {
        //console.log('val = ', value)
        if (value.includes("Добавить всех")) {
            let newWhoPays = new Array(this.props.namesArray.length);
            let newProportions = new Array(this.props.namesArray.length);
            let i = 0
            for (let f of this.props.namesArray) {

                newWhoPays[i] = f.key;
                newProportions[i] = {
                    id: this.props.getIdByName(f.text),
                    part: 1,
                };
                i += 1
            }

            this.setState({
                whoPays: newWhoPays,
                proportions: newProportions,
            });
        } else {
            let newProportions = new Array(value.length);
            let i = 0
            for (let f of value) {
                //console.log('f = ', f)
                newProportions[i] = {
                    id: f,
                    part: 1,
                };
                i += 1
            }
            this.setState({
                whoPays: value,
                proportions: newProportions,
            }, () => {
                //console.log('set. whoPays = ', this.state.whoPays, ". props = ", this.state.proportions)
            });
        }
    }

    handleWhoPaysEditChange(e, { name, value }) {
        //console.log('val = ', value)
        if (value.includes("Добавить всех")) {
            let newWhoPays = new Array(this.props.namesArray.length);
            let newProportions = new Array(this.props.namesArray.length);
            let i = 0
            for (let f of this.props.namesArray) {

                newWhoPays[i] = f.key;
                newProportions[i] = {
                    id: this.props.getIdByName(f.text),
                    part: 1,
                };
                i += 1
            }

            this.setState({
                whoPaysEdit: newWhoPays,
                proportionsEdit: newProportions,
            });
        } else {
            let newProportions = new Array(value.length);
            let i = 0
            for (let f of value) {
                //console.log('f = ', f)
                newProportions[i] = {
                    id: f,
                    part: 1,
                };
                i += 1
            }
            this.setState({
                whoPaysEdit: value,
                proportionsEdit: newProportions,
            }, () => {
                //console.log('set. whoPays = ', this.state.whoPays, ". props = ", this.state.proportions)
            });
        }
    }

    handleProportionsChange(id, value) {
        let proportions_new = this.state.proportions.slice()
        let i = 0
        while (i < proportions_new.length && proportions_new[i].id != id) {
            i += 1
        }
        if (i == proportions_new.length) {
            console.log('handleProportionsChange error! id ', id, ' was not found!')
            return
        }
        proportions_new[i].part += value
        if (proportions_new[i].part < 1) proportions_new[i].part = 1
        this.setState({
            proportions: proportions_new,
        })
    }

    handleProportionsEditChange(id, value) {
        let proportions_new = this.state.proportionsEdit.slice()
        let i = 0
        while (i < proportions_new.length && proportions_new[i].id != id) {
            i += 1
        }
        if (i == proportions_new.length) {
            console.log('handleProportionsChange error! id ', id, ' was not found!')
            return
        }
        proportions_new[i].part += value
        if (proportions_new[i].part < 1) proportions_new[i].part = 1
        this.setState({
            proportionsEdit: proportions_new,
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
        if (!this.state.proportions.length) {
            return
        }
        let g = this.state.proportions[0].part;
        for (let i of this.state.proportions) {
            g = this.gcd(g, i.part)
        }

        let proportions_new = this.state.proportions.slice()
        for (let n in proportions_new) {
            proportions_new[n].part = proportions_new[n].part / g
        }
        this.setState({
            proportions: proportions_new,
        })

    }

    reduceProportionsEdit() {
        // find gcd and divide by it every number
        if (!this.state.proportionsEdit.length) {
            return
        }
        let g = this.state.proportionsEdit[0].part;
        for (let i of this.state.proportionsEdit) {
            g = this.gcd(g, i.part)
        }

        let proportions_new = this.state.proportionsEdit.slice()
        for (let n in proportions_new) {
            proportions_new[n].part = proportions_new[n].part / g
        }
        this.setState({
            proportionsEdit: proportions_new,
        })

    }

    getWhoPaysOptions() {
        return this.props.namesArray.length ?
            (this.props.namesArray.length == this.state.whoPays.length ? [] :
                [{ key: "Добавить всех", text: "Добавить всех", value: "Добавить всех", icon: "plus" }])
                .concat(this.props.namesArray)
            : []
    }



    render() {
        return (
            <div>
                {/* <Segment basic> */}
                <div>
                    {isMobile &&

                        <MobileAddMenu
                            namesArray={this.props.namesArray}
                            whoBought={this.state.whoBought}
                            handleWhoPaysChange={this.handleWhoPaysChange}
                            whoPays={this.state.whoPays}
                            proportions={this.state.proportions}
                            handleProportionsChange={this.handleProportionsChange}
                            handleInputChange={this.handleInputChange}
                            inputPriceText={this.state.inputPriceText}
                            inputQuantityText={this.state.inputQuantityText}
                            inputNameText={this.state.inputNameText}
                            handleAddRow={this.props.handleAddRow}
                            resetInputs={this.resetInputs}
                            reduceProportions={this.reduceProportions}
                            handleWhoBoughtChange={this.handleWhoBoughtChange}
                            getWhoPaysOptions={this.getWhoPaysOptions}
                            getNameById={this.props.getNameById}
                        />
                    }
                    <Table
                        // selectable 
                        stackable
                        celled
                    //basic
                    >

                        <Table.Body>
                            {isBrowser &&

                                <Table.Row>
                                    <Table.Cell width={4}>
                                        <p className='tableFont'>
                                            <Input
                                                fluid
                                                className='placeholderCentering textAlignCenter'
                                                placeholder='Название продукта'
                                                onChange={(e) => this.handleInputChange('Name', e)}
                                                value={this.state.inputNameText}
                                                error={this.state.nameError}
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
                                                error={this.state.whoBoughtError}
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
                                                clearable
                                                options={this.getWhoPaysOptions()}
                                                onChange={this.handleWhoPaysChange}
                                                value={this.state.whoPays}
                                                error={this.state.whoPaysError}
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
                                                        reduceProportions={this.reduceProportions}
                                                        getNameById={this.props.getNameById}
                                                        error={this.state.proportionsError}

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
                                            <Input
                                                fluid
                                                label={{ basic: true, content: '₽' }}
                                                labelPosition='right'
                                                placeholder='Цена'
                                                //label='Цена'
                                                error={this.state.priceError}
                                                onChange={(e) => this.handleInputChange('Price', e)}
                                                value={this.state.inputPriceText}
                                            />


                                            <Input
                                                fluid
                                                //width={1}
                                                //type="number"// тогда число не вмещается 
                                                label='Кол-во'
                                                style={{ paddingTop: '10px' }}
                                                className='placeholderCentering textAlignCenter'
                                                size='mini'
                                                error={this.state.quantityError}

                                                placeholder=''
                                                onChange={(e) => this.handleInputChange('Quantity', e)}
                                                value={this.state.inputQuantityText}
                                            />
                                        </p>
                                    </Table.Cell>

                                    <Table.Cell width={1}>
                                        <p className='tableFont'>
                                            <Button circular fluid onClick={() => {
                                                if (this.checkAllFields()) {
                                                    this.props.handleAddRow(
                                                        this.state.inputNameText,
                                                        this.state.whoBought,
                                                        //this.state.whoPays,
                                                        parseInt(this.state.inputPriceText),
                                                        parseInt(this.state.inputQuantityText),
                                                        this.state.proportions
                                                    );
                                                    this.resetInputs();
                                                }
                                            }}>
                                                <p className='textAlignCenter '>
                                                    <Icon name='add' />
                                                </p>

                                            </Button>
                                        </p>
                                    </Table.Cell>

                                </Table.Row>

                            }


                            {this.props.tableData.map((row, index) => {
                                return (
                                    <Table.Row>
                                        <Table.Cell width={4}>
                                            <p className={isMobile ? 'tableHeaderFont' : "tableFont"}>
                                                {row.name}
                                            </p>
                                        </Table.Cell>

                                        <Table.Cell width={4}>
                                            <p className='tableFont'>
                                                {this.props.getNameById(row.whoBoughtId)}
                                            </p>
                                        </Table.Cell>

                                        <Table.Cell width={4}>
                                            <p className='tableFont'>
                                                {/* {row.whoPays.map((e, i) => ((i == row.whoPays.length - 1) ? e : e + ', '))}<br /> */}
                                                
                                                {(row.proportions.length == this.props.namesArray.length && 
                                                this.props.namesArray.length > 2) ?
                                                <b>Все</b> : 
                                                (row.proportions.map((e, i) => ((i == row.proportions.length - 1) ?
                                                    this.props.getNameById(e.id)
                                                    :
                                                    this.props.getNameById(e.id) + ', ')))
                                                }
                                                    
                                                <br />

                                                <text className='tableFontProportions' style={{ paddingTop: '0', marginInlineStart: 0 }}>
                                                    {
                                                        row.proportions.length == 1 ? '' : (row.proportions.every(v => v.part === row.proportions[0].part)
                                                            ?
                                                            'поровну'
                                                            :
                                                            (row.proportions.map((e, i) => ((i == row.proportions.length - 1) ?
                                                                e.part
                                                                :
                                                                e.part + ' : ')))
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
                                                <EditMenu
                                                    tableData={this.props.tableData}
                                                    //index={index}
                                                    productId={row.id}
                                                    namesArray={this.props.namesArray}
                                                    whoBought={this.state.whoBoughtEdit}
                                                    handleWhoPaysChange={this.handleWhoPaysEditChange}
                                                    whoPays={this.state.whoPaysEdit}
                                                    proportions={this.state.proportionsEdit}
                                                    handleProportionsChange={this.handleProportionsEditChange}
                                                    handleInputChange={this.handleInputEditChange}
                                                    inputPriceText={this.state.inputPriceTextEdit}
                                                    inputQuantityText={this.state.inputQuantityTextEdit}
                                                    resetInputs={this.resetInputsEdit}
                                                    reduceProportions={this.reduceProportionsEdit}
                                                    handleWhoBoughtChange={this.handleWhoBoughtEditChange}
                                                    getWhoPaysOptions={this.getWhoPaysOptions}
                                                    fillDataToEdit={this.fillDataToEdit}
                                                    handleChangeRow={this.props.handleChangeRow}
                                                    inputNameText={this.state.inputNameTextEdit}
                                                    removeRow={this.props.removeRow}
                                                    getNameById={this.props.getNameById}
                                                />
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