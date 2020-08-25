import React from "react";
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
      tableData:
        [
          {
            product: 'Чипсы Lays с беконом, 100г',
            whoBought: 'Серго',
            whoPays: 'Ваня, Даня, Серго',
            price: 57,
            quantity: 1
          },

          {
            product: 'Квас "Очаковский"',
            whoBought: 'Ваня',
            whoPays: 'Ваня, Даня, Серго',
            price: 73,
            quantity: 2
          },
        ],
      namesText: '',
      namesArray: [],
    };
    this.handleMenuChange = this.handleMenuChange.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleNamesChange = this.handleNamesChange.bind(this);
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
        value: i,
        text: a,
      });
      ++i;
    }
    return ans;
  }

  handleAddRow(name, whoBought, whoPays, price, quantity) {
    this.setState(state => ({

      tableData: state.tableData.concat({

        product: name,
        whoBought: whoBought,
        whoPays: whoPays,
        price: price,
        quantity: quantity

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

  componentDidMount(props) {
    //backend connect 

    if (debugging) {
      this.setState({
        page: 'products',
        namesText: 'Серго\r\nСаня\r\nВаня\r\nДаня'
      });
    }
  }

  render() {
    return (
      <div>
        <Header as="h1" textAlign="center" style={{ paddingTop: "20px" }}>
          <Icon name="clipboard list" />
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


              <Grid columns={3} stackable style={{ paddingBottom: "20px", }}>
                <Grid.Column >

                  <Segment relaxed style={{ minHeight: '203px' }}>
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
                        3. Нажми на зелёную кнопку и получи рассчет чека (сколько кто кому должен скинуть).
                        <br /><br />
                        У тебя будет ссылка, которой можно поделиться с друзьями, вау!
                        🥳
                        </List.Content>
                      </List.Item>
                    </List>
                  </Segment>


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



              <TableOfProducts
                tableData={this.state.tableData}
                handleAddRow={this.handleAddRow}
                namesArray={this.formSearchFromArray(this.state.namesArray)}
              />
              <div style={{ textAlign: "center", paddingTop: "15px" }}>
                <Button positive>Рассчитать СколькоСкинуть</Button>
              </div>
            </div>

          }

        </Container>


      </div >
    );
  }
}

export default App;
