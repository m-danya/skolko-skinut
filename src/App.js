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
import { w3cwebsocket as W3CWebSocket } from "websocket";
import {
  BrowserView,
  isBrowser,
  isMobile,
  MobileView,
} from "react-device-detect";
import { BrowserRouter as Router, Link } from 'react-router-dom'
import ss_logo from './assets/logo.png'

const axios = require('axios').default;
var ws_client;

const BACKEND_ADDRESS = 'https://skolkoskinut.ru'
//const BACKEND_ADDRESS = 'http://194.87.248.62:8000'
//const BACKEND_ADDRESS = 'https://0.0.0.0:8000'

var debugging = false;


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "main", // do not change. 
      //projectname: "temp project name", // need to fix this: add naming system
      tableData: [],
      namesArray: [],
      calculated: false,
      namesIds: [],
      guided: false,
    };
    this.handleMenuChange = this.handleMenuChange.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleChangeRow = this.handleChangeRow.bind(this)
    this.handleRemoveName = this.handleRemoveName.bind(this);
    this.handleAddName = this.handleAddName.bind(this);
    this.handleCalculate = this.handleCalculate.bind(this);
    this.fillDebugInfo = this.fillDebugInfo.bind(this);
    this.generateNewProjectToken = this.generateNewProjectToken.bind(this);
    this.updateBackend = this.updateBackend.bind(this);
    this.removeRow = this.removeRow.bind(this);
    this.getNameById = this.getNameById.bind(this);
    this.getTableItemIndexByProductId = this.getTableItemIndexByProductId.bind(this);
    this.getIdByName = this.getIdByName.bind(this);
  }

  handleMenuChange(a) {
    if (a == 'products' && !this.state.id) {
      this.generateNewProjectToken()
    } else
      this.setState({
        page: a,
      });
  }

  formSearchFromArray() {
    let ans = [];
    if (!this.state.namesIds || !this.state.namesIds.length) return ans;
    //console.log("this.state.namesIds = ", this.state.namesIds)
    for (let a of this.state.namesIds) {

      ans.push({
        key: a.id,
        value: a.id,
        text: a.name,
      });
    }
    return ans;
  }

  handleAddRow(name, whoBoughtId, price, quantity, proportions) {
    this.setState(state => ({
      tableData: state.tableData.concat({
        name: name,
        whoBoughtId: whoBoughtId,
        price: price,
        quantity: quantity,
        proportions: proportions,
        id: this.uuidv4(),
      }),
      calculated: false,
    }), () => {
      this.updateBackend();
    });

  }

  handleChangeRow(id, name, whoBought, price, quantity, proportions) {
    let index = this.getTableItemIndexByProductId(id)
    this.state.tableData[index].name = name.slice();
    this.state.tableData[index].whoBoughtId = whoBought;
    this.state.tableData[index].price = price;
    this.state.tableData[index].quantity = quantity;
    this.state.tableData[index].proportions = proportions.slice();
    this.updateBackend();
    this.setState({
      calculated: false,
    })
  }

  updateBackend() {
    console.log('go go axios! update')

    axios.put(`${BACKEND_ADDRESS}/api/update/${this.state.id}`, {
      'id': this.state.id,
      'name': this.state.projectname,
      'persons': this.state.namesIds,
      'products': this.state.tableData
    }).then(res => {
      console.log('update res: ', res)
      console.log(this.state.tableData)
      //if it's internal error
      if (res.status == 500)
        console.log('Неотловленная ошибка на backend-части, ошибка 500')
      if (res.status == 404)
        console.log('Не удалось установить связь с backend-сервером. ошибка 404')
      if (res.status == 200) {
        //console.log('YAHOOOOOOOOOOOOOOOOOOOOO. updated.')
        console.log('send?')
        if (ws_client) {
          console.log('send!')
          ws_client.send(JSON.stringify({
            type: "message",
            msg: "hey",
          }));
        }
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

  generateNewProjectToken(guided = false) {
    let new_id = this.uuidv4()
    this.setState({
      id: new_id,
      guided: guided,
    })

    // BACKEND: CREATE NEW PROJECT
    console.log('go go axios: create')

    axios.post(`${BACKEND_ADDRESS}/api/create`, {
      'id': new_id,
      'name': this.state.projectname,
      //'guided': guided, // bool
    }).then(res => {
      //console.log('res: ', res)
      //if it's internal error
      if (res.status == 500)
        console.log('Неотловленная ошибка на backend-части, ошибка 500')
      if (res.status == 404)
        console.log('Не удалось установить связь с backend-сервером. ошибка 404')
      if (res.status == 201) {
        //console.log('YAHOOOOOOOOOOOOOOOOOOOOO. created.')
        window.location.href = "/" + new_id;
      }
    }, (e) => {
      console.log('post request error: ', e);
    });

  }

  handleAddName(name) {
    let new_namesIds = this.state.namesIds.slice()
    new_namesIds.push({
      'name': name,
      'id': this.uuidv4()
    })

    this.setState({
      namesArray: [...this.state.namesArray, name],
      namesIds: new_namesIds,
      calculated: false,
    }, () => {
      this.updateBackend();
    })
  }


  handleRemoveName(name) {
    let newNamesArray = this.state.namesArray.slice()
    let new_namesIds = this.state.namesIds.slice()
    newNamesArray.splice(newNamesArray.indexOf(name), 1)
    let index = 0;
    for (index in new_namesIds) {
      if (new_namesIds[index].name == name) {
        //console.log('found ', name)
        break
      }
    }

    let id = this.getIdByName(name);
    for (let i in this.state.tableData) {
      if (this.state.tableData[i].whoBoughtId == id) {
        // человек купил этот продукт
        this.removeRow(this.state.tableData[i].id)
        continue
      }
      for (let j in this.state.tableData[i].proportions) {
        if (this.state.tableData[i].proportions[j].id == id) {
          this.state.tableData[i].proportions.splice(j, 1)
          if (!this.state.tableData[i].proportions.length) {
            // это был единственный, кто скидывался!
            this.removeRow(this.state.tableData[i].id)
          }
          break
        }
      }
    }

    new_namesIds.splice(index, 1)
    this.setState({
      namesArray: newNamesArray,
      namesIds: new_namesIds,
      calculated: false,
    }, () => {
      this.updateBackend();

    })
  }

  getIdByName(name) {
    for (let n in this.state.namesIds) {
      if (this.state.namesIds[n].name == name) {
        return this.state.namesIds[n].id
      }
    }
    return "-1"
  }

  getNameById(id) {
    for (let n in this.state.namesIds) {
      if (this.state.namesIds[n].id == id) {
        return this.state.namesIds[n].name
      }
    }
    return "Незнакомец"
  }

  getTableItemIndexByProductId(id) {
    for (let i in this.state.tableData) {
      if (this.state.tableData[i].id == id) {
        return i
      }
    }
    console.log("index not found in getTableItemIndexByProductId!!!")
    return -1
  }


  go(person, left, target, relations, sequences, profits, seq, ints) {
    if (left == 0) {
      return
    }
    //console.log('go. args = ', person, left, target, relations, sequences, profits, seq, ints)
    seq.push(person)
    for (let p of this.state.namesArray) {
      if (relations[person][p] > 0) {
        if (p == target) {
          ints.push(relations[person][p])

          //console.log('FOUND CHAIN! seq = ', seq, 'ints = ', ints, 'relations = ', relations)
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
    for (let p_name of this.state.namesArray) {
      relations[p_name] = {}
      for (let q_name of this.state.namesArray) {
        relations[p_name][q_name] = 0
      }
    }

    for (let event of this.state.tableData) {
      let sum = 0
      for (let f of event.proportions) {
        sum += f.part
      }
      let price = event.price * event.quantity / sum
      //console.log('price = ', price)
      for (let paying_person_and_part of event.proportions) {
        relations[this.getNameById(paying_person_and_part.id)][this.getNameById(event.whoBoughtId)] += price * paying_person_and_part.part;
        //console.log(paying_person, ' += ', price * event.proportions[i])
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

  removeRow(id) {
    let index = this.getTableItemIndexByProductId(id)
    delete this.state.tableData.splice(index, 1)
    this.setState({
      calculated: false,
    }, () => { this.updateBackend() });
  }

  relationsIsNotEmpty() {
    for (let n1 of this.state.namesArray) {
      for (let n2 of this.state.namesArray) {
        if (this.state.relations[n1][n2]) {
          return true;
        }
      }
    }
    return false;
  }


  makeGetRequest() {
    axios.get(`${BACKEND_ADDRESS}/api/get/${this.state.id}`,).then(res => {
      //console.log('get res: ', res)
      //if it's internal error
      if (res.status == 500)
        console.log('Неотловленная ошибка на backend-части, ошибка 500')
      if (res.status == 404)
        console.log('Не удалось установить связь с backend-сервером. ошибка 404')
      // if (res.status == 201) {
      //   //window.location.href = "/" + new_id;
      // }
      let result = res.data
      //console.log(result)
      if (result) {
        let names = []

        for (let t of result.persons) {
          names.push(t.name)
          //console.log('push ', t.name)
        }

        for (let p of result.products) {
          //p.proportions = JSON.parse(p.proportions)
        }

        this.setState({
          page: 'products',
          tableData: result.products.slice(),
          projectname: result.name.slice(),
          namesIds: result.persons.slice(),
          namesArray: names.slice(),
          guided: result.name == "guided test project",//result.guided,
        }, () => {
          if (this.state.guided && this.state.tableData.length == 0) {
            this.fillDebugInfo();
          }
        })
      }
    }, (e) => {
      console.log('get request error: ', e);
    });
  }

  fillDebugInfo() {
    let pid1 = this.uuidv4();
    let pid2 = this.uuidv4();
    let pid3 = this.uuidv4();
    let pid4 = this.uuidv4();
    let pid5 = this.uuidv4();

    let id_sergo = this.uuidv4();
    let id_danya = this.uuidv4();
    let id_sanya = this.uuidv4();
    let id_vanya = this.uuidv4();
    this.setState({
      page: 'products',
      namesArray: ['Серго', 'Даня', 'Саня', 'Ваня'],
      namesIds: [
        {
          'name': 'Серго',
          'id': id_sergo
        },
        {
          'name': 'Даня',
          'id': id_danya
        },
        {
          'name': 'Саня',
          'id': id_sanya
        },
        {
          'name': 'Ваня',
          'id': id_vanya
        },
      ],
      tableData:
        [
          {
            name: 'Квас "Очаковский"',
            whoBoughtId: id_danya,
            price: 98,
            quantity: 1,
            proportions: [
              { "id": id_vanya, "part": 1 },
              { "id": id_danya, "part": 1 }
            ],
            id: pid1
          },
          {
            name: 'Квас "Никола"',
            whoBoughtId: id_vanya,
            price: 87,
            quantity: 2,
            proportions: [
              { "id": id_sergo, "part": 1 },
              { "id": id_vanya, "part": 1 },
              { "id": id_danya, "part": 1 }
            ],
            id: pid2

          },
          {
            name: 'Квас "Лидский"',
            whoBoughtId: id_sergo,
            price: 73,
            quantity: 2,
            proportions: [
              { "id": id_danya, "part": 1 }
            ],
            id: pid3

          },
          {
            name: 'Ржаной хлеб',
            whoBoughtId: id_sergo,
            price: 45,
            quantity: 2,
            proportions: [
              { "id": id_sergo, "part": 1 },
              { "id": id_danya, "part": 2 },
              { "id": id_sanya, "part": 3 },
              { "id": id_vanya, "part": 1 },
            ],
            id: pid4

          },
          {
            name: 'Бородинский хлеб',
            whoBoughtId: id_vanya,
            price: 58,
            quantity: 4,
            proportions: [
              { "id": id_sergo, "part": 1 },
              { "id": id_danya, "part": 1 },
              { "id": id_vanya, "part": 1 },
            ],
            id: pid5
          },

        ],

    }, () => {
      this.updateBackend();
    });
    this.setState({
      calculated: false,
    })
  }

  componentDidMount(props) {
    if (this.props.match.params.id) {
      let id = this.props.match.params.id
      this.setState({
        id: id,
        page: 'products',
      }, () => {
        this.makeGetRequest();
      })
      ws_client = new W3CWebSocket(`wss://skolkoskinut.ru/ws/${id}`);
      ws_client.onopen = () => {
        console.log('WS: WebSocket Client Connected');
      };

      ws_client.onmessage = (message) => {
        const dataFromServer = JSON.parse(message.data);
        console.log('WS: got reply! ', dataFromServer);
        this.makeGetRequest();
      };

    }
    if (debugging) {
      this.fillDebugInfo();
    }
  }

  render() {
    return (
      <div>
        <div

          style={{
            backgroundImage: "url(/background1.png)",
            // height: "300px",
            //backgroundRepeat: "no-repeat"
          }}
        >
          <Header as="h1" textAlign="center" style={{ paddingTop: "20px" }}>
          </Header>
          {/* <Link to="/"> */}

          <Image
            src={ss_logo}
            //size='small'
            size='medium'
            //href="https://skolkoskinut.ru/"
            onClick={() => {
              this.setState({
                page: 'main'
              })
            }}
            style={{ paddingBottom: "20px" }}
            centered
          />
          {/* </Link> */}
        </div>

        <Container>
          <MyMenu
            hasId={this.props.match.params.id}
            activeItem={this.state.page}
            handleItemClick={this.handleMenuChange}
          />
        </Container>
        <Container>
          {
            this.state.page == 'main' &&
            <div>
              {/* <Segment.Group>
              <Segment>  */}

              <div style={{
                padding: "10px 0 10px 0",
                // width: isBrowser ? "300px" : "80%",
                //  class: "textAlignCenter"
              }}
                className='textAlignCenter'
              >
                <Button
                  //size="big"
                  color='orange'
                  centered
                  fluid
                  className="centeredButton"
                  style={{ width: isMobile ? "100%" : "400px" }}
                  onClick={() => {
                    //this.handleMenuChange('products');
                    this.setState({
                      guided: false,
                      projectname: "temp project name"
                    }, () => {
                      this.generateNewProjectToken();
                    });
                  }} >
                  <p className='textAlignCenter '>
                    Создать пустой проект
                      </p>
                </Button>
                {/* </Link> */}

              </div>
              <div>
                <Button
                  style={{ width: isMobile ? "100%" : "400px" }}
                  //size="massive"
                  //positive
                  color='green'
                  centered
                  fluid
                  className="centeredButton"
                  onClick={() => {
                    //this.handleMenuChange('products');
                    this.setState({
                      guided: true,
                      projectname: "guided test project"
                    }, () => {
                      this.generateNewProjectToken(true);
                    });
                  }} >
                  <p className='textAlignCenter '>

                    Пройти обучение
                    </p>
                </Button>
              </div>
              <Segment

              >
                <Header as="h3">
                  Добро пожаловать!
                </Header>
                {/* <p style={{ marginTop: "-5px", }}> СколькоСкинуть - веб-приложение для таких-то задач, подходит ваще всем потому-то. </p> */}
                <p style={{ marginTop: "-5px", }}>
                  {/* 
                    <b style={{ color: "red" }}>
                      Ведутся технические работы, в данный момент сервис работает нестабильно. <br /> Следите за обновлениями, осталось чуть-чуть :)
                    </b>
                    <br /><br /> */}

                  В данный момент программа находится в стадии альфа-теста —
                  перед Вами лишь предварительная, модельная версия продукта.
                  Она может быть неустойчива к заведомо (или случайно) некорректно введённым входным данным.
                <br /><br />
                В будущем планируется реализовать множество функций, не представленных в текущей версии (а также полный редизайн),
                однако, если у вас есть какие-либо предложения по улучшению функционала или если вы заметили
                некорректную работу программы, просьба написать разработчикам.
                <br /><br />
                Приятного использования!
                <br /><br />

                </p>
              </Segment>

              {/* </Segment.Group>  */}
            </div>
          }

          {
            this.state.page == 'products' &&
            <div>

              {/* <Segment relaxed > */}
              {this.state.guided ?
                <div>
                  
                  <Grid columns={2} stackable style={{
                    paddingBottom: "20px",
                    paddingTop: isBrowser ? "20px" : "" ,
                  }}
                  //divided={isBrowser}
                  >
                    {isBrowser && <Grid.Column width={8}>
                      <div
                      //style={{ minHeight: isBrowser ? '203px' : '' }} 
                      >
                        <div style={{
                          padding: "10px 0 10px 0",
                          textAlign: "center"
                        }}>
                          <ChooseNames
                            handleRemoveName={this.handleRemoveName}
                            handleAddName={this.handleAddName}
                            namesArray={this.state.namesArray}
                            namesIds={this.state.namesIds}
                            centered={true}
                          />
                          <br />

                          <br />

                        Это <b>демо-проект</b>. Когда поймешь, как работает интерфейс, <br />
                          <a
                            onClick={() => {
                              this.setState({
                                page: 'main',
                              })
                            }}
                          > создай пустой проект</a>
                        , чтобы внести туда свои данные.

                        </div>
                      </div>

                    </Grid.Column>
                    }
                    <Grid.Column
                      style={{
                        // backgroundColor: '#E5E7E7',
                      }}
                    >
                      <div
                      //style={{ minHeight: '203px' }} 
                      >
                        <Header as="h3" style={{ paddingTop: isMobile ? "20px" : "10px" }}>
                          Как пользоваться?
                        </Header>
                        <List relaxed>
                          <List.Item>
                            <List.Content>
                              1. Заполни список людей
                          </List.Content>
                          </List.Item>
                          <List.Item>
                            <List.Content>
                              {/* <List.Header>Два</List.Header> */}
                          2. Добавь продукты в таблицу
                       </List.Content>
                          </List.Item>
                          <List.Item>
                            <List.Content>
                              {/* <List.Header>Три</List.Header> */}
                        3. Нажми на зелёную кнопку и узнай, сколько кто кому должен скинуть!
                        <br /><br />У тебя будет ссылка, которой можно поделиться с друзьями
                        🥳
                        <br /><br />

                        {isMobile && <div><br />

Это <b>демо-проект</b>. Когда поймешь, как работает интерфейс,
                                <a
                                  onClick={() => {
                                    this.setState({
                                      page: 'main',
                                    })
                                  }}
                                > создай пустой проект</a>
, чтобы внести туда свои данные.
  </div>}
                            </List.Content>
                          </List.Item>
                        </List>
                      </div>
                    </Grid.Column>

                    {/* <Grid.Column >
                    
                    <div style={{ minHeight: '' }} >

                      <Button
                        color='orange'
                        fluid
                        onClick={this.fillDebugInfo}
                      >
                        Заполнить демонстрационными данными</Button>

                    </div>


                  </Grid.Column> */}
                  </Grid>
                  {isMobile && <div style={{
                    padding: "10px 0 10px 0",
                    // width: isBrowser ? "300px" : "80%",
                    // class: "textAlignCenter"
                  }}>
                    <ChooseNames
                      handleRemoveName={this.handleRemoveName}
                      handleAddName={this.handleAddName}
                      namesArray={this.state.namesArray}
                      namesIds={this.state.namesIds}
                    />
                  </div>
                  }
                </div>

                :

                <div>
                  <div style={{
                    padding: "10px 0 10px 0",
                    // width: isBrowser ? "300px" : "80%",
                    // class: "textAlignCenter"
                  }}>
                    <ChooseNames
                      handleRemoveName={this.handleRemoveName}
                      handleAddName={this.handleAddName}
                      namesArray={this.state.namesArray}
                      namesIds={this.state.namesIds}
                      centered={true}
                    />
                  </div>
                </div>

              }
              {/* 
              </Segment> */}

              <TableOfProducts
                tableData={this.state.tableData}
                handleAddRow={this.handleAddRow}
                handleChangeRow={this.handleChangeRow}
                namesArray={this.formSearchFromArray()}
                removeRow={this.removeRow}
                getNameById={this.getNameById}
                getTableItemIndexByProductId={this.getTableItemIndexByProductId}
                getIdByName={this.getIdByName}
              />
              {this.state.tableData.length > 0 &&

                <div style={{ textAlign: "center", padding: "15px 0px" }}>
                  <Button
                    positive
                    size='big'
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
                        {this.relationsIsNotEmpty() ? "" :
                          "Никто никому ничего не должен"
                        }
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


      </div >
    );
  }
}

export default App;
