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

var debugging = false;


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "main", // do not change. (see componentDidMount for debug)
      tableData: [],
      namesText: '',
      namesArray: [],
      calculated: false,
    };
    this.handleMenuChange = this.handleMenuChange.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleNamesChange = this.handleNamesChange.bind(this);
    this.handleCalculate = this.handleCalculate.bind(this);
    this.fillDebugInfo = this.fillDebugInfo.bind(this);

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

        product: name,
        whoBought: whoBought,
        whoPays: whoPays,
        price: price,
        quantity: quantity,
        proportions: proportions

      }),

    }));
  }

  handleNamesChange(event) {
    //console.log(event);
    this.setState({
      namesText: event.target.value,
      namesArray: (event.target.value.split(/\r?[\n,]\s?/).filter((element) => element))
    });
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
            product: 'Квас "Очаковский"',
            whoBought: 'Даня',
            whoPays: ['Ваня', 'Даня'],
            price: 98,
            quantity: 1,
            proportions: [1, 1]
          },
          {
            product: 'Квас "Никола"',
            whoBought: 'Ваня',
            whoPays: ['Серго', 'Даня', 'Ваня'],
            price: 87,
            quantity: 2,
            proportions: [1, 1, 1]
          },
          {
            product: 'Квас "Лидский"',
            whoBought: 'Серго',
            whoPays: ['Даня'],
            price: 73,
            quantity: 2,
            proportions: [1]
          },
          {
            product: 'Ржаной хлеб',
            whoBought: 'Серго',
            whoPays: ['Серго', 'Даня', 'Саня', 'Ваня'],
            price: 45,
            quantity: 2,
            proportions: [1, 2, 3, 1]
          },
          {
            product: 'Бородинский хлеб',
            whoBought: 'Ваня',
            whoPays: ['Серго', 'Даня', 'Ваня'],
            price: 58,
            quantity: 4,
            proportions: [1, 1, 1]
          },

        ],

    });
  }

  componentDidMount(props) {
    //backend connect 

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
                <p style={{ marginTop: "-5px", }}> СколькоСкинуть - веб-приложение для таких-то задач, подходит ваще всем потому-то. </p>
              </Segment>
              <Segment>
                <Grid ui centered>
                  <Grid.Row>
                    <Button positive size="massive" onClick={() => { this.handleMenuChange('products') }} >
                      Начать без регистрации
                        </Button>
                  </Grid.Row>
                  <Grid.Row style={{ paddingTop: 0 }}>
                    <Button primary size="massive" onClick={() => { this.handleMenuChange('products') }}>
                      Войти
                        </Button>
                  </Grid.Row>
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
                  <Grid.Column >
                    <div style={{ minHeight: '203px' }} >

                    </div>
                  </Grid.Column>
                  <Grid.Column >

                    <div style={{ minHeight: '203px' }} >

                      <Button
                        color='orange'
                        fluid
                        onClick={this.fillDebugInfo}
                      >Заполнить демонстраницонными данными</Button>

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
                namesArray={this.formSearchFromArray(this.state.namesArray)}
              />
              <div style={{ textAlign: "center", padding: "15px 0px" }}>
                <Button
                  positive
                  onClick={this.handleCalculate}
                >
                  Рассчитать СколькоСкинуть</Button>
              </div>

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
                      <div style={{ textAlign: "center" }}>
                        <Button
                          color='blue'
                        //onClick={this.handleCalculate}

                        >
                          <Icon name='share' />
                          Поделиться</Button>
                      </div>
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
