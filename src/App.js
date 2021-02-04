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
import ss_logo from './assets/logo.png'

const axios = require('axios').default;


const BACKEND_ADDRESS = 'https://skolkoskinut.ru'
//const BACKEND_ADDRESS = 'http://194.87.248.62:8000'
//const BACKEND_ADDRESS = 'https://0.0.0.0:8000'

var debugging = 0;


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "main", // do not change. 
      //projectname: "temp project name", // need to fix this: add naming system
      tableData: [],
      namesText: '',
      namesArray: [],
      calculated: false,
      namesIds: [],
      guided: false,
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
    console.log("this.state.namesIds = ", this.state.namesIds)
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

  generateNewProjectToken(guided = false) {
    let new_id = this.uuidv4()
    this.setState({
      id: new_id,
      guided: guided,
    })

    // BACKEND: CREATE NEW PROJECT
    console.log('go go axios!')

    axios.post(`${BACKEND_ADDRESS}/api/create`, {
      'id': new_id,
      'name': this.state.projectname,
      //'guided': guided, // bool
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
      namesArray: [...new Set(event.target.value.split(/\r?[\n,]\s?/).filter((element) => element))]
    }, () => {
      this.updateNameIds();

    });
    this.setState({
      calculated: false,
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

  updateNameIds() {
    let new_namesIds = this.state.namesIds.slice()
    for (let name of this.state.namesArray) {
      if (this.getIdByName(name) == -1) {
        console.log('new name: ', name)
        new_namesIds.push({
          'name': name,
          'id': this.uuidv4()
        })
      }
    }

    for (let i in new_namesIds) {
      if (!this.state.namesArray.includes(new_namesIds[i].name)) {
        console.log("name ", new_namesIds[i].name, " was not found!")
        new_namesIds.splice(i, 1)
      }
    }

    this.setState({
      namesIds: new_namesIds
    }, () => {
      this.updateBackend();

    })
    //console.log()

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
    })
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
      namesText: 'Серго\r\nСаня\r\nВаня\r\nДаня', // только для демо-инфы задаётся вручную
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
      })
      // get-request
      axios.get(`${BACKEND_ADDRESS}/api/get/${id}`,).then(res => {
        //console.log('get res: ', res)
        //if it's internal error
        if (res.status == 500)
          console.log('Неотловленная ошибка на backend-части, ошибка 500')
        if (res.status == 404)
          console.log('Не удалось установить связь с backend-сервером. ошибка 404')
        if (res.status == 201) {
          //window.location.href = "/" + new_id;
        }
        let result = res.data
        //console.log(result)
        if (result) {
          let names = []

          for (let t of result.persons) {
            names.push(t.name)
            //console.log('push ', t.name)
          }

          for (let p of result.products) {
            p.proportions = JSON.parse(p.proportions)
          }

          this.setState({
            page: 'products',
            tableData: result.products.slice(),
            projectname: result.name.slice(),
            namesIds: result.persons.slice(),
            namesArray: names.slice(),
            namesText: names.join("\n"),
            guided: result.name == "guided test project",//result.guided,
          }, () => {
            if (this.state.guided && this.state.tableData.length == 0) {
              this.fillDebugInfo();
            }
            //this.updateNameIds();
          })
        }
      }, (e) => {
        console.log('get request error: ', e);
      });
    }
    if (debugging) {
      this.fillDebugInfo();
    }
  }

  render() {
    return (
      <div>
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

        <Container>
          <MyMenu
            activeItem={this.state.page}
            handleItemClick={this.handleMenuChange}
          />
        </Container>
        <Container>
          {
            this.state.page == 'main' &&
            <div>
              {/* <Segment.Group>
              <Segment> */}
              <Grid ui centered>
                <Grid.Row>
                  {/* <Link to={'this.generateNewProjectToken'} > */}
                  <Button
                    size="massive"
                    color='orange'
                    onClick={() => {
                      //this.handleMenuChange('products');
                      this.setState({
                        guided: false,
                        projectname: "temp project name"
                      }, () => {
                        this.generateNewProjectToken();
                      });
                    }} >
                    Создать пустой проект
                        </Button>
                  {/* </Link> */}
                </Grid.Row>
                <Grid.Row
                  style={{ paddingTop: 0 }}
                >
                  <Button
                    size="massive"
                    positive
                    onClick={() => {
                      //this.handleMenuChange('products');
                      this.setState({
                        guided: true,
                        projectname: "guided test project"
                      }, () => {
                        this.generateNewProjectToken(true);
                      });
                    }} >
                    Пройти обучение
                        </Button>

                </Grid.Row>
              </Grid>
              {/* </Segment>*/
                <Segment

                >
                  <Header as="h3">
                    Добро пожаловать!
                </Header>
                  {/* <p style={{ marginTop: "-5px", }}> СколькоСкинуть - веб-приложение для таких-то задач, подходит ваще всем потому-то. </p> */}
                  <p style={{ marginTop: "-5px", }}>

                    <b style={{ color: "red" }}>
                      Ведутся технические работы, в данный момент сервис работает нестабильно. <br /> Следите за обновлениями :)
                    </b>
                    <br /><br />

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
              /*
            </Segment.Group> */}
            </div>
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

              {/* <Segment relaxed > */}
              {this.state.guided ?
                <Grid columns={3} stackable style={{ paddingBottom: "20px", }}>
                  <Grid.Column>
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
                        <br />
                            <br />
                        Это <b>демо-проект</b>. Когда поймешь, как работает интерфейс,
                        <a
                              onClick={() => {
                                this.setState({
                                  page: 'main',
                                })
                              }}
                            > создай пустой проект</a>
                        , чтобы внести туда свои данные.
                        </List.Content>
                        </List.Item>
                      </List>
                    </div>
                  </Grid.Column>
                  {isBrowser && <Grid.Column >
                    <div style={{ minHeight: '203px' }} >

                    </div>
                  </Grid.Column>}
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
                :

                <div>
                  <div style={{
                    padding: "10px 0 10px 0",
                    // width: isBrowser ? "300px" : "80%",
                    // class: "textAlignCenter"
                  }}>
                    <ChooseNames
                      handleNamesChange={this.handleNamesChange}
                      namesText={this.state.namesText}
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
