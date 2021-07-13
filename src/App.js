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
import swal from 'sweetalert';

/* global VK */
import {
  BrowserView,
  isBrowser,
  isMobile,
  MobileView,
} from "react-device-detect";
import Helmet from "react-helmet"
import EditProjectName from "./EditProjectName"
import VkGroup from './VkGroup'

import { BrowserRouter as Router, Link } from 'react-router-dom'
import ss_logo from './assets/logo.png'
import VkLogin from "./VkLogin.js";
import MoreInfo from "./MoreInfo.js";


const axios = require('axios').default;
var ws_client;

const BACKEND_ADDRESS = 'https://skolkoskinut.ru'

const phrases = [
  "Очередная попойка у Фон Глена",
  "Корпоратив разработчиков СколькоСкинуть",
  "Friends Reuinion",
  "Страховые взносы для альпинизма",
  "Неудачное свидание",
  "Запутанная история",
];

var debugging = false;


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "main", // do not change. 
      tableData: [],
      namesArray: [],
      calculated: false,
      namesIds: [],
      guided: false,
      loadingEmpty: false,
      loadingGuided: false,
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
    this.handleProjectNameChange = this.handleProjectNameChange.bind(this);
    this.handleProjectNameInputChange = this.handleProjectNameInputChange.bind(this);
    this.updatePersonalData = this.updatePersonalData.bind(this);
  }

  updatePersonalData(data) {
    this.setState({
      personalData: data,
    });
  }

  printObject(data) {
    console.log(JSON.stringify(data, null, 4));
  }

  handleMenuChange(a) {
    if (a == 'products' && !this.state.id) {
      this.generateNewProjectToken()
    } else
      this.setState({
        page: a,
      });
  }

  handleProjectNameChange(newName) {
    this.setState({
      projectname: newName,
    }, () => {
      this.updateBackend();
    });
  }

  handleProjectNameInputChange(newName) {
    this.setState({
      projectnameInput: newName,
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
        order_number: state.tableData.length ? state.tableData[state.tableData.length - 1].order_number + 1 : 1,
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
            msg: "hey", // it's not a debug message!
          }));
        }
        //window.location.href = "/" + new_id;
      }
    }, (e) => {
      console.log('put request error. gonna wait for 3 sec');
      setTimeout(this.updateBackend, 3000);
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
      'id': this.uuidv4(),
      'order_number': this.state.namesIds.length ? this.state.namesIds[this.state.namesIds.length - 1].order_number + 1 : 1,
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
    // todo: полностью переписать 
    let newNamesArray = this.state.namesArray.slice()
    let new_namesIds = this.state.namesIds.slice()
    newNamesArray.splice(newNamesArray.indexOf(name), 1)
    let index = 0;
    let id;
    for (let i in new_namesIds) {
      if (new_namesIds[i].name == name) {
        //console.log('found ', name)
        index = i;
        id = new_namesIds[i].id;
        break
      }
    }

    for (let i in this.state.tableData) {
      if (this.state.tableData[i].whoBoughtId == id) {
        // человек купил этот продукт
        return false;
        // this.removeRow(this.state.tableData[i].id)
        // continue
      }
      for (let j in this.state.tableData[i].proportions) {
        if (this.state.tableData[i].proportions[j].id == id) {
          return false;
          // this.state.tableData[i].proportions.splice(j, 1)
          // if (!this.state.tableData[i].proportions.length) {
          //   // это был единственный, кто скидывался!
          //   // this.removeRow(this.state.tableData[i].id)
          //   // continue;
          // }
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
    return true;
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


  brilliant_dfs(person, left, target, relations, profits, seq, ints) {
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
            relations[seq[pint]][seq[(pint + 1) % seq.length]] -= min_num;
          }
          for (let i in ints) {
            ints[i] -= min_num;
          }
          ints.pop()
          //sequences.push(seq.slice())
        } else if (!seq.includes(p)) {
          ints.push(relations[person][p])
          this.brilliant_dfs(p, left - 1, target, relations, profits, seq, ints)
          ints.pop()
        }

      }
    }
    seq.pop()
  }


  handleCalculate(event) {
    let relations = {} // relations[КТО][КОМУ]
    let expenses = {} // [КТО] = сколько стоило мероприятие ему
    let commonplace_dict = {}
    for (let p_name of this.state.namesArray) {
      expenses[p_name] = 0
      relations[p_name] = {}
      commonplace_dict[p_name] = 0
      for (let q_name of this.state.namesArray) {
        relations[p_name][q_name] = 0
      }
    }

    for (let event of this.state.tableData) {
      let all_parts = 0;
      for (let f of event.proportions) {
        all_parts += f.part
      }
      let one_part_price = event.price * event.quantity / all_parts
      expenses[this.getNameById(event.whoBoughtId)] += event.price * event.quantity;
      //console.log('price = ', price)
      for (let paying_person_and_part of event.proportions) {
        let money = Math.round(one_part_price * paying_person_and_part.part);
        commonplace_dict[this.getNameById(paying_person_and_part.id)] += money;
        commonplace_dict[this.getNameById(event.whoBoughtId)] -= money; // + на - даёт 0
        // пересчёт персональных затрат:
        expenses[this.getNameById(paying_person_and_part.id)] += money;
        expenses[this.getNameById(event.whoBoughtId)] -= money;
        // relations[this.getNameById(paying_person_and_part.id)][this.getNameById(event.whoBoughtId)] += one_part_price * paying_person_and_part.part;
        //console.log(paying_person, ' += ', price * event.proportions[i])
      }
      
    }

    for (let p_name of this.state.namesArray) {
      relations[p_name][p_name] = 0;
    }

    console.log('after +')
    this.printObject(expenses);


    let commonplace_pos = []
    let commonplace_neg = []
    for (let name in commonplace_dict) {
      if (commonplace_dict[name] > 0) {
        commonplace_pos.push({ 'name': name, 'money': commonplace_dict[name] });
      } else if (commonplace_dict[name] < 0) {
        commonplace_neg.push({ 'name': name, 'money': -commonplace_dict[name] });
      }
    }

    commonplace_pos.sort((a, b) => b.money - a.money);
    commonplace_neg.sort((a, b) => b.money - a.money); // the sign has already been taken into account

    while (commonplace_pos.length > 0) {
      console.log('pos and neg:')
      this.printObject(commonplace_pos)
      this.printObject(commonplace_neg)
      let payment = Math.min(commonplace_neg[0].money, commonplace_pos[0].money)
      relations[commonplace_pos[0].name][commonplace_neg[0].name] += payment
      commonplace_neg[0].money -= payment
      commonplace_pos[0].money -= payment
      if (commonplace_neg[0].money == 0) {
        commonplace_neg.splice(0, 1);
      } else {
        commonplace_neg.sort((a, b) => b.money - a.money);
      }
      if (commonplace_pos[0].money == 0) {
        commonplace_pos.splice(0, 1);
      } else {
        commonplace_pos.sort((a, b) => b.money - a.money);
      }
    }

    // for (let q_name of this.state.namesArray) { 
    // Rest In Peace, dfs
    //   this.brilliant_dfs(q_name, this.state.namesArray.length, q_name, relations, [], [], [])
    // }

    this.setState({
      calculated: true,
      relations: Object.assign({}, relations),
      expenses: Object.assign({}, expenses)
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

        let newNamesIds = result.persons.slice();
        newNamesIds.sort((a, b) => a.order_number - b.order_number);

        for (let t of newNamesIds) {
          names.push(t.name)
          //console.log('push ', t.name)
        }

        let newTableData = result.products.slice();
        newTableData.sort((a, b) => a.order_number - b.order_number);

        this.setState({
          page: 'products',
          tableData: newTableData.slice(),
          projectname: result.name.slice(),
          namesIds: newNamesIds.slice(),
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
          'id': id_sergo,
          'order_number': 1
        },
        {
          'name': 'Даня',
          'id': id_danya,
          'order_number': 2
        },
        {
          'name': 'Саня',
          'id': id_sanya,
          'order_number': 3
        },
        {
          'name': 'Ваня',
          'id': id_vanya,
          'order_number': 4
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
            id: pid1,
            'order_number': 1
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
            id: pid2,
            'order_number': 2

          },
          {
            name: 'Квас "Лидский"',
            whoBoughtId: id_sergo,
            price: 73,
            quantity: 2,
            proportions: [
              { "id": id_danya, "part": 1 }
            ],
            id: pid3,
            'order_number': 3

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
            id: pid4,
            'order_number': 4

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
            id: pid5,
            'order_number': 5
          },

        ],

    }, () => {
      this.updateBackend();
    });
    this.setState({
      calculated: false,
    })
  }

  configureSocket(id) {
    ws_client = new W3CWebSocket(`wss://skolkoskinut.ru/ws/${id}`);
    ws_client.onopen = () => {
      console.log('WS: WebSocket Client Connected');
      this.updateBackend();
    };

    ws_client.onmessage = (message) => {
      //const dataFromServer = message.data;
      console.log('WS: got reply!');
      this.makeGetRequest();
    };

    ws_client.onclose = (event) => {
      ws_client = null
      setTimeout(this.configureSocket, 5000)
      console.log('ws closed: ', event)
      // this.setState({
      //   needToReloadWebSocket: true,
      // })
    }

    ws_client.onerror = (event) => {
      console.log('ws error: ', event)
      this.setState({
        needToReloadWebSocket: true,
      })
    }
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
      this.configureSocket(id);

    }
    if (debugging) {
      this.fillDebugInfo();
    }

    this.postponedCalculation(10);

  }

  postponedCalculation(left) {
    if (this.state.tableData.length > 0) {
      this.handleCalculate();
    } else {
      if (left > 0) {
        setTimeout(() => { this.postponedCalculation(left - 1) }, 300);
      }
    }
  }

  componentDidUpdate() {
    if (this.state.needToReloadWebSocket) {
      swal("Нужно перезагрузить страницу", "Связь с сервером потеряна", "error");
    }
  }
  render() {

    return (
      <div>
        <Helmet>
          <title> {(() => {
            if (this.state.projectname != "guided test project" && this.state.projectname) {
              return "СколькоСкинуть. " + this.state.projectname
            } else if (this.state.projectname) {
              return "СколькоСкинуть. Обучение"
            } else {
              return "СколькоСкинуть"
            }
          })()} </title>
          <meta name="description" content="Веб-приложение, которое посчитает за Вас, кто кому сколько должен скинуть!" />
        </Helmet>
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
            className="clickable"
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
                  loading={this.state.loadingEmpty}
                  className="centeredButton"
                  style={{ width: isMobile ? "100%" : "400px" }}
                  onClick={() => {
                    //this.handleMenuChange('products');
                    this.setState({
                      guided: false,
                      projectname: "Событие на миллион",
                      loadingEmpty: true,
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
                  loading={this.state.loadingGuided}
                  fluid
                  className="centeredButton"
                  onClick={() => {
                    //this.handleMenuChange('products');
                    this.setState({
                      guided: true,
                      loadingGuided: true,
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
                <p style={{ marginTop: "-5px", fontSize: "16px", marginBottom: "15px" }}>
                  {/* 
                    <b style={{ color: "red" }}>
                      Ведутся технические работы, в данный момент сервис работает нестабильно. <br /> Следите за обновлениями, осталось чуть-чуть :)
                    </b>
                    <br /><br /> */}
                  СколькоСкинуть — это сайт, который после тусовки поможет Вам узнать, сколько денег вы должны перевести друг другу.
                  <br /><br />
                  Ссылку можно будет скинуть друзьям — они смогут увидеть расчёт и внести изменения.
                  <br /><br />
                  Алгоритм <b>уменьшит количество переводов</b> между людьми до минимума, чтобы всем было проще.
                  <br /><br />
                  Приятного использования! Будем рады любой Вашей обратной связи в сообщениях в нашей <a href="https://vk.com/skolkoskinut">группе ВКонтакте</a>
                </p>
                <VkGroup />

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
                    paddingTop: isBrowser ? "20px" : "",
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
                              3. Нажми на кнопку внизу и узнай, сколько кто кому должен скинуть!
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
                  {isMobile && !this.state.guided && <div style={{
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
                  <div
                    style={{
                      padding: isBrowser ? "10px 0 0px 0" : "10px 0 10px 0",
                      // width: isBrowser ? "300px" : "80%",
                    }}
                    className={isBrowser ? "leftright" : ""}
                  >
                    <div
                      className={isBrowser ? "centertextdiv" : ""}
                    >
                      <h2

                        style={{ fontSize: "1.5rem" }}
                        className={isBrowser ? "centertexttext" : ""}
                      >
                        {this.state.projectname}
                        &nbsp;

                        <EditProjectName
                          handleProjectNameChange={this.handleProjectNameChange}
                          handleProjectNameInputChange={this.handleProjectNameInputChange}
                          projectnameInput={this.state.projectnameInput}
                          projectname={this.state.projectname}
                        />
                        <Icon name="refresh" style={{ fontSize: "0.5em" }} className="clickable"
                          onClick={() => {
                            swal({
                              title: "",
                              text: "Вы действительно хотите поменять название проекта на случайное?",
                              icon: "info",
                              buttons: true,
                              dangerMode: false,
                            })
                              .then((willRefresh) => {
                                if (willRefresh) {
                                  this.handleProjectNameChange(phrases[Math.floor((Math.random() * phrases.length))])
                                } else {
                                  // safe
                                }
                              });
                          }}
                        />
                      </h2>
                    </div>

                    {isBrowser && <div style={{
                      padding: "10px 0 10px 0",
                      // width: isBrowser ? "300px" : "80%",
                      // class: "textAlignCenter"

                    }}
                    >
                      <ChooseNames
                        handleRemoveName={this.handleRemoveName}
                        handleAddName={this.handleAddName}
                        namesArray={this.state.namesArray}
                        namesIds={this.state.namesIds}
                        centered={false}
                        rightAligned={true}
                      />
                    </div>
                    }


                  </div>
                </div>


              }

              {isMobile && <div>
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
                                      {name2}: {this.state.relations[name][name2]} ₽
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
                      <MoreInfo
                        namesArray={this.state.namesArray}
                        expenses={this.state.expenses}
                      />
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
          {
            this.state.page == 'login' &&
            <Segment basic>
              <div>
                <VkLogin
                  personalData={this.state.personalData}
                  updatePersonalData={this.updatePersonalData}
                />
              </div>
            </Segment>
          }
        </Container>


      </div >
    );
  }
}

export default App;
