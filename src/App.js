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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "main", // change to main!
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
        ]
    };
    this.handleMenuChange = this.handleMenuChange.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
  }

  handleMenuChange(a) {
    this.setState({
      page: a,
    });
  }

  handleAddRow(name, whoBought, whoPays, price) {
    this.setState(state => ({

      tableData: state.tableData.concat({

        product: name,
        whoBought: whoBought,
        whoPays: whoPays,
        price: price,

      }),

    }));
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
                <Grid.Column>

                  <Segment relaxed style={{ minHeight: '203px' }}>
                    <Header as="h3" style={{ paddingTop: "0px" }}>
                      Как пользоваться?
                        </Header>
                    <List relaxed>
                      <List.Item>
                        <List.Content>
                          1. Впиши имена всех людей 🧕🎅
                        </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Content>
                          {/* <List.Header>Два</List.Header> */}
                          2. Добавь продукты в таблицу 🍩🍾
                       </List.Content>
                      </List.Item>
                      <List.Item>
                        <List.Content>
                          {/* <List.Header>Три</List.Header> */}
                        3. Нажми на кнопку и получи рассчет чека (сколько кто кому должен скинуть). 
                        <br /><br />
                        У тебя будет ссылка, которой можно поделиться с друзьями, вау!
                        🥳
                        </List.Content>
                      </List.Item>
                    </List>
                  </Segment>


                </Grid.Column>
                <Grid.Column style={{ minHeight: '203px' }}>
                  <Form>
                    <TextArea 
                    fluid 
                    style={{ minHeight: '203px' }}
                    placeholder={'Серго\r\nДаня\r\nВаня\r\nСаня'} />
                  </Form>
                </Grid.Column>

                <Grid.Column>
                  еще какой-то блок. 
                </Grid.Column>
              </Grid>



              <TableOfProducts
                tableData={this.state.tableData}
                handleAddRow={this.handleAddRow}
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
