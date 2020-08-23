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
  Menu,
  Segment,
  Step,
  Table,
  GridColumn,
} from "semantic-ui-react";
import MyMenu from "./Menu.js";
import TableOfProducts from './TableOfProducts'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "products", // change to main!
      tableData:
        [
          {
            product: 'Чипсы Lays с беконом, 100г',
            whoBought: 'Серго',
            whoAte: 'Ваня, Даня, Серго',
            price: '57'
          },

          {
            product: 'Квас "Очаковский"',
            whoBought: 'Ваня',
            whoAte: 'Ваня, Даня, Серго',
            price: '73'
          },
        ]
    };
    this.handleMenuChange = this.handleMenuChange.bind(this);
  }

  handleMenuChange(a) {
    this.setState({
      page: a,
    });
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
                    <Button positive size="massive" onClick={() => {this.handleMenuChange('products')}} > 
                      Начать без регистрации
                        </Button>
                  </Grid.Row>
                <Grid.Row style={{ paddingTop: 0 }}>
                  <Button primary size="massive" onClick={() => {this.handleMenuChange('products')}}>
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
              люди
              </Segment>
          </Segment.Group>

        }

        {
          this.state.page == 'products' &&
          <div>
            <TableOfProducts
              tableData={this.state.tableData}
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
