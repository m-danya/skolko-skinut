import React, { useEffect, useRef } from "react";
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Image,
  Item,
  Label,
  Form,
  TextArea,
  List,
  Menu,
  Segment,
  Step,
  Table,
  Modal,
  GridColumn,
} from "semantic-ui-react";
import MyMenu from "./Menu.js";
import TableOfProducts from './TableOfProducts'
import ChooseNames from './ChooseNames'
import ShareMenu from './ShareMenu'
import {
  BrowserView,
  isBrowser,
  MobileView,
} from "react-device-detect";
import { BrowserRouter as Router, Link } from 'react-router-dom'

const axios = require('axios').default;


//const BACKEND_ADDRESS = 'https://skolkoskinut.ru'
//const BACKEND_ADDRESS = 'http://194.87.248.62:8000'
const BACKEND_ADDRESS = 'https://0.0.0.0:8000'


var debugging = 0;


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "main", // do not change. (see componentDidMount for debug)
      projectname: "temp project name", // need to fix this: add naming system
      tableData: [],
      namesText: '',
      namesArray: [],
      calculated: false,
      namesIds: [],
      namesIdsSergo: [],
    };
    this.handleMenuChange = this.handleMenuChange.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleChangeRow = this.handleChangeRow.bind(this)
    this.handleNamesChange = this.handleNamesChange.bind(this);
    this.handleCalculate = this.handleCalculate.bind(this);
    this.fillDebugInfo = this.fillDebugInfo.bind(this);
    this.generateNewProjectToken = this.generateNewProjectToken.bind(this);
    this.updateBackend = this.updateBackend.bind(this);
    this.updateNameIds = this.updateNameIds.bind(this);
    this.updateProductIds = this.updateProductIds.bind(this);
  }

  handleMenuChange(a) {
    this.setState({
      page: a,
    });
  }

  formSearchFromArray(list) {
    // console.log("list = " + list);
    let ans = [];
    let i = 0;
    if (!list) return ans;
    for (let a of list) {
      ans.push({
        key: a,
        value: a,
        //value: i,
        text: a,
      });
      ++i;
    }
    return ans;
  }

  handleAddRow(name, whoBought, whoPays, price, quantity, proportions) {
    this.setState(state => ({

      tableData: state.tableData.concat({

        name: name,
        whoBought: whoBought,
        whoPays: whoPays,
        price: price,
        quantity: quantity,
        proportions: proportions,
        id: this.uuidv4(),

      }),

    }), () => {
      this.updateProductIds();
      this.updateBackend();
    });
  }

  handleChangeRow(index, name, whoBought, whoPays, price, quantity, proportions) {
    this.state.tableData[index].name = name.slice();
    this.state.tableData[index].whoBought = whoBought.slice();
    this.state.tableData[index].whoPays = whoPays.slice();
    this.state.tableData[index].price = price;
    this.state.tableData[index].quantity = quantity;
    this.state.tableData[index].proportions = proportions.slice();
    this.updateProductIds();
    this.updateBackend();
  }

  updateBackend() {
    console.log('go go axios! update')

    axios.put(`${BACKEND_ADDRESS}/api/update/${this.state.id}`, {
      'id': this.state.id,
      'name': this.state.projectname,
      'persons': this.state.namesIdsSergo,
      'products': this.state.tableData
    }).then(res => {
      console.log('update res: ', res)
      //if it's internal error
      if (res.status == 500)
        console.log('Неотловленная ошибка на backend-части, ошибка 500')
      if (res.status == 404)
        console.log('Не удалось установить связь с backend-сервером. ошибка 404')
      if (res.status == 201) {
        console.log('YAHOOOOOOOOOOOOOOOOOOOOO. updated.')
        //window.location.href = "/" + new_id;
      }

    }, (e) => {
      console.log('put request error: ', e);
    });

  }


  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  generateNewProjectToken() {
    let new_id = this.uuidv4()
    this.setState({
      id: new_id,
    })

    // BACKEND: CREATE NEW PROJECT
    console.log('go go axios!')

    axios.post(`${BACKEND_ADDRESS}/api/create`, {
      'id': new_id,
      'name': this.state.projectname,
    }).then(res => {
      console.log('res: ', res)
      //if it's internal error
      if (res.status == 500)
        console.log('Неотловленная ошибка на backend-части, ошибка 500')
      if (res.status == 404)
        console.log('Не удалось установить связь с backend-сервером. ошибка 404')
      if (res.status == 201) {
        console.log('YAHOOOOOOOOOOOOOOOOOOOOO. created.')
        window.location.href = "/" + new_id;
      }
    }, (e) => {
      console.log('post request error: ', e);
    });

  }


  handleNamesChange(event) {
    //console.log(event);
    this.setState({
      namesText: event.target.value,
      namesArray: (event.target.value.split(/\r?[\n,]\s?/).filter((element) => element))
    }, () => {
      this.updateNameIds();
      
    });
  }

  getNameId(name) {
    for (let n in this.state.namesIds) {
      if (n == name) {
        return this.state.namesIds[n]
      }
    }
    return "-1"
  }

  getIdName(id) {
    for (let n in this.state.namesIds) {
      if (this.state.namesIds[n] == id) {
        return n
      }
    }
    return "Незнакомец"
  }

  getIdNameA(id, namesIds) {
    for (let n in namesIds) {
      if (namesIds[n].id == id) {
        return namesIds[n].name
      }
    }
    return "Незнакомец"
  }

  updateNameIds() {
    let new_namesIds = Object.assign({}, this.state.namesIds)
    let new_namesIdsSergo = []
    for (let name of this.state.namesArray) {
      if (!new_namesIds[name]) {
        //console.log('new name: ', name)
        new_namesIds[name] = this.uuidv4()
      }
    }

    for (let existing_name in new_namesIds) {
      if (!this.state.namesArray.includes(existing_name)) {
        delete new_namesIds[existing_name]
      }
    }

    for (let name in new_namesIds) {
      new_namesIdsSergo.push({
        'name': name,
        'id': new_namesIds[name]
      })
    }

    this.setState({
      namesIds: Object.assign({}, new_namesIds),
      namesIdsSergo: new_namesIdsSergo
    }, () => {
      this.updateProductIds();
      this.updateBackend();

    })
    //console.log()

  }

  updateProductIds() {
    for (let p_i in this.state.tableData) { //product_index
      this.state.tableData[p_i].whoBoughtId = this.getNameId(this.state.tableData[p_i].whoBought)
      this.state.tableData[p_i].whoPaysId = []
      for (let p_p in this.state.tableData[p_i].whoPays) {
        this.state.tableData[p_i].whoPaysId[p_p] = this.getNameId(this.state.tableData[p_i].whoPays[p_p])
      }
    }
  }

  go(person, left, target, relations, sequences, profits, seq, ints) {
    if (left == 0) {
      return
    }
    console.log('go. args = ', person, left, target, relations, sequences, profits, seq, ints)
    seq.push(person)
    for (let p of this.state.namesArray) {
      if (relations[person][p] > 0) {
        if (p == target) {
          ints.push(relations[person][p])

          console.log('FOUND CHAIN! seq = ', seq, 'ints = ', ints, 'relations = ', relations)
          let min_num = ints[0]
          for (let num of ints) {
            if (num < min_num) {
              min_num = num
            }
          }
          for (let t in seq) {
            let pint = parseInt(t)
            console.log(seq[pint], ' won\'t pay', min_num, " to ", seq[(pint + 1) % seq.length])
            relations[seq[pint]][seq[(pint + 1) % seq.length]] -= min_num
          }
          ints.pop()
          //sequences.push(seq.slice())
        } else if (!seq.includes(p)) {
          ints.push(relations[person][p])
          this.go(p, left - 1, target, relations, sequences, profits, seq, ints)
          ints.pop()
        }

      }
    }
    seq.pop()
  }


  handleCalculate(event) {
    let relations = {} // relations[КТО][КОМУ]
    console.log(relations)
    for (let p_name of this.state.namesArray) {
      relations[p_name] = {}
      for (let q_name of this.state.namesArray) {
        relations[p_name][q_name] = 0
      }
    }

    for (let event of this.state.tableData) {
      let sum = 0
      for (let f of event.proportions) {
        sum += f
      }
      let price = event.price * event.quantity / sum
      let i = 0
      //console.log('price = ', price)
      for (let paying_person of event.whoPays) {
        relations[paying_person][event.whoBought] += price * event.proportions[i];
        console.log(paying_person, ' += ', price * event.proportions[i])
        i += 1;
      }
      for (let p_name of this.state.namesArray) {
        relations[p_name][p_name] = 0;
      }
      for (let q_name of this.state.namesArray) {
        this.go(q_name, this.state.namesArray.length, q_name, relations, [], [], [], [])
      }

    }

    for (let p_name of this.state.namesArray) {
      relations[p_name][p_name] = 0;
    }



    this.setState({
      calculated: true,
      relations: Object.assign({}, relations),
    }, () => {
      window.scrollTo({
        top: document.body.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    });

  }

  fillDebugInfo() {
    this.setState({
      page: 'products',
      namesText: 'Серго\r\nСаня\r\nВаня\r\nДаня',
      namesArray: ['Серго', 'Даня', 'Саня', 'Ваня'],
      tableData:
        [
          {
            name: 'Квас "Очаковский"',
            whoBought: 'Даня',
            whoPays: ['Ваня', 'Даня'],
            price: 98,
            quantity: 1,
            proportions: [1, 1],
            id: 'e5194d58-bfa3-4877-bd73-a0ffd776b23b'
          },
          {
            name: 'Квас "Никола"',
            whoBought: 'Ваня',
            whoPays: ['Серго', 'Даня', 'Ваня'],
            price: 87,
            quantity: 2,
            proportions: [1, 1, 1],
            id: '3b123021-f8f2-4506-8be6-b3e2f2891490'

          },
          {
            name: 'Квас "Лидский"',
            whoBought: 'Серго',
            whoPays: ['Даня'],
            price: 73,
            quantity: 2,
            proportions: [1],
            id: 'cddc7886-a28e-4bdb-bf7d-25fa97306b62'

          },
          {
            name: 'Ржаной хлеб',
            whoBought: 'Серго',
            whoPays: ['Серго', 'Даня', 'Саня', 'Ваня'],
            price: 45,
            quantity: 2,
            proportions: [1, 2, 3, 1],
            id: '2a9a0fc0-3767-4eff-b1c4-10e32a6fc3ad'

          },
          {
            name: 'Бородинский хлеб',
            whoBought: 'Ваня',
            whoPays: ['Серго', 'Даня', 'Ваня'],
            price: 58,
            quantity: 4,
            proportions: [1, 1, 1],
            id: 'd847b272-e34d-4713-be6a-4116672a2721'
          },

        ],

    }, () => { this.updateNameIds(); });
  }

  componentDidMount(props) {
    //backend connect 
    if (this.props.match.params.id) {
      let id = this.props.match.params.id
      this.setState({
        id: id,
      })
      // LOAD tableData FROM BACKEND HERE!!!!!!!!!!!!!!!!!!!1
      axios.get(`${BACKEND_ADDRESS}/api/get/${id}`,).then(res => {
        console.log('get res: ', res)
        //if it's internal error
        if (res.status == 500)
          console.log('Неотловленная ошибка на backend-части, ошибка 500')
        if (res.status == 404)
          console.log('Не удалось установить связь с backend-сервером. ошибка 404')
        if (res.status == 201) {
          console.log('YAHOOOOOOOOOOOOOOOOOOOOO. got data.')
          //window.location.href = "/" + new_id;
        }
        let result = res.data
        console.log('data got: ')
        console.log(result)
        if (result) {
          let names = []

          for (let t of result.persons) {
            names.push(t)
          }

          for (let p of result.products) {
            p.whoBought = this.getIdNameA(p.whoBoughtId, result.persons)
            p.whoPays = []
            for (let g in p.whoPaysId) {
              p.whoPays.push(this.getIdNameA(p.whoPaysId[g], result.persons))
            }
            p.proportions = JSON.parse(p.proportions)
          }
          
          this.setState({
            page: 'products',
            tableData: result.products.slice(),
            name: result.name.slice(),
            namesIds: result.persons.slice(),
            namesArray: names.slice()
          }, () => {
            //this.updateNameIds();
            
            console.log('after all updates tableData = ', this.state.tableData)
          
          })
        }
      }, (e) => {
        console.log('get request error: ', e);
      });



      //console.log('I\'VE GOT THE ID: ', id)
    }
    if (debugging) {
      this.fillDebugInfo();
    }
  }

  render() {
    return (
      <div>
        <Header as="h1" textAlign="center" style={{ paddingTop: "20px" }}>
          <Icon name="chart pie" />
          СколькоСкинуть
        </Header>
        <Container>
          <MyMenu
            activeItem={this.state.page}
            handleItemClick={this.handleMenuChange}
          />
        </Container>
        <Container>
          {
            this.state.page == 'main' &&

            <Segment.Group>
              <Segment>
                <Header as="h3">
                  Добро пожаловать!
                </Header>
                {/* <p style={{ marginTop: "-5px", }}> СколькоСкинуть - веб-приложение для таких-то задач, подходит ваще всем потому-то. </p> */}
                <p style={{ marginTop: "-5px", }}> 
                В данный момент программа находится в стадии альфа-теста.
                 </p>
              </Segment>
              <Segment>
                <Grid ui centered>
                  <Grid.Row>
                    {/* <Link to={'this.generateNewProjectToken'} > */}
                    <Button positive size="massive" onClick={() => {
                      //this.handleMenuChange('products');
                      this.generateNewProjectToken()
                    }} >
                      Начать
                        </Button>
                    {/* </Link> */}
                  </Grid.Row>
                  {/* <Grid.Row style={{ paddingTop: 0 }}>
                    <Button primary size="massive" onClick={() => { this.handleMenuChange('products') }}>
                      Войти
                        </Button>
                  </Grid.Row> */}
                </Grid>
              </Segment>
            </Segment.Group>
          }

          {
            this.state.page == 'people' &&

            <Segment.Group>
              <Segment>
                404
              </Segment>
            </Segment.Group>

          }

          {
            this.state.page == 'products' &&
            <div>

              <Segment relaxed >

                <Grid columns={3} stackable style={{ paddingBottom: "20px", }}>
                  <Grid.Column  >

                    <div style={{ minHeight: '203px' }} >
                      <Header as="h3" style={{ paddingTop: "0px" }}>
                        Как пользоваться?
                        </Header>
                      <List relaxed>
                        <List.Item>
                          <List.Content>
                            1. Впиши имена всех людей:
                          <div style={{ padding: "10px 0 10px 0", }}>
                              <ChooseNames
                                handleNamesChange={this.handleNamesChange}
                                namesText={this.state.namesText}
                              />
                            </div>
                          </List.Content>
                        </List.Item>
                        <List.Item>
                          <List.Content>
                            {/* <List.Header>Два</List.Header> */}
                          2. Добавь продукты в таблицу ниже
                       </List.Content>
                        </List.Item>
                        <List.Item>
                          <List.Content>
                            {/* <List.Header>Три</List.Header> */}
                        3. Нажми на зелёную кнопку и получи расчёт чека (сколько кто кому должен скинуть).
                        <br /><br />
                        У тебя будет ссылка, которой можно поделиться с друзьями, вау!
                        🥳
                        </List.Content>
                        </List.Item>
                      </List>
                    </div>


                  </Grid.Column>
                  {isBrowser && <Grid.Column >
                    <div style={{ minHeight: '203px' }} >

                    </div>
                  </Grid.Column>}
                  <Grid.Column >

                    <div style={{ minHeight: '' }} >

                      <Button
                        color='orange'
                        fluid
                        onClick={this.fillDebugInfo}
                      >
                        Заполнить демонстрационными данными</Button>

                    </div>


                  </Grid.Column>


                  {/* <Grid.Column style={{ minHeight: '203px' }}>

                  { <Form>
                    <TextArea 
                    fluid 
                    style={{ minHeight: '203px' }}
                    placeholder={'Серго\r\nДаня\r\nВаня\r\nСаня'}
                    onChange={this.handleNamesChange} 
                    value={this.state.namesText}
                    />
                  </Form> }
                </Grid.Column>

                <Grid.Column>
                  еще какой-то блок.
                </Grid.Column> */}
                </Grid>

              </Segment>

              <TableOfProducts
                tableData={this.state.tableData}
                handleAddRow={this.handleAddRow}
                handleChangeRow={this.handleChangeRow}
                namesArray={this.formSearchFromArray(this.state.namesArray)}
              />
              {this.state.tableData.length > 0 &&

                <div style={{ textAlign: "center", padding: "15px 0px" }}>
                  <Button
                    positive
                    onClick={this.handleCalculate}
                  >
                    Рассчитать СколькоСкинуть</Button>
                </div>
              }

              {this.state.calculated &&

                <div style={{ textAlign: "center", paddingTop: "15px" }}>
                  <Grid ui centered>
                    <Grid.Row>
                      {/* <Segment
                      textAlign='center'
                      size='big'
                      
                    > */}
                      <List
                        size='big'
                        celled
                        verticalAlign="middle"
                        ref={el => { this.el = el; }}
                      >

                        {this.state.namesArray.map((name) => {
                          return (
                            this.state.namesArray.map((name2) => {
                              return (
                                this.state.relations[name][name2] ?
                                  <List.Item>
                                    <List.Content><text
                                      style={{ height: "70px", lineHeight: "70px" }}
                                    >
                                      {name} <Icon name='long arrow alternate right' />
                                      {name2}: {Math.round(this.state.relations[name][name2])} ₽
                                  </text>
                                    </List.Content>
                                  </List.Item> :
                                  "")
                            })
                          )
                        })}
                      </List>
                      {/* </Segment> */}
                    </Grid.Row>
                    <Grid.Row>
                      <ShareMenu
                        copyText={'https://skolkoskinut.ru/' + this.state.id}
                      />


                    </Grid.Row>

                  </Grid>

                </div>
              }
            </div>


          }

        </Container>

        {/* <Segment.Group>
          <Segment>
            
          </Segment>
        </Segment.Group> */}


      </div >
    );
  }
}

export default App;
