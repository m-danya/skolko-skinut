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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "main",
    };
    this.handleMenuChange = this.handleMenuChange.bind(this);
  }

  handleMenuChange(a) {
    let newState = this.state;
    newState.page = a;
    this.setState(newState);
    //console.log("menu changed: " + a);
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
          {[this.state.page].map((page) => {
            if (page == "main")
              return (
                <Segment.Group>
                  <Segment>
                    <Header as="h3">
                      Приветствие и яркое описание приложения (мб со скринами){" "}
                    </Header>
                  </Segment>
                  <Segment>
                    <Grid ui centered>
                      <Grid.Row>
                        <Button positive size="massive">
                          Создать проект
                        </Button>
                      </Grid.Row>
                      <Grid.Row style={{ paddingTop: 0 }}>
                        <Button primary size="massive">
                          {" "}
                          Войти через ВКонтакте
                        </Button>
                      </Grid.Row>
                    </Grid>
                  </Segment>
                </Segment.Group>
              );
            if (page == "people") return <div>people</div>;
          })}
        </Container>
      </div>
    );
  }
}

export default App;
