import React from "react";
import { Menu, Icon } from "semantic-ui-react";

class MyMenu extends React.Component {
  render() {
    return (
      <div style={{ paddingBottom: "15px", }}>
        <Menu
          //inverted
          //stackable
          compact
          borderless
          fluid
          //vertical
          style={{ fontSize: "16px" }}
        >
          <Menu.Item
            name="main"
            active={this.props.activeItem === "main"}
            onClick={() => this.props.handleItemClick('main')}
          >
            <Icon name='content' />
            Главная
          </Menu.Item>

          {/* <Menu.Item
            name="people"
            active={this.props.activeItem === "people"}
            onClick={() => this.props.handleItemClick('people')}
          >
              <Icon name='user' />
            Люди
          </Menu.Item> */}

          <Menu.Item
            name="products"
            disabled={!this.props.hasId}
            active={this.props.activeItem === "products"}
            onClick={() => this.props.handleItemClick('products')}
          >
            <Icon name='calculator' />
            Продукты
          </Menu.Item>

          <Menu.Item
            name="login"
            active={this.props.activeItem === "login"}
            onClick={() => this.props.handleItemClick('login')}
          >
            <Icon name='sign-in' />
            Войти
          </Menu.Item>

          {/* <Menu.Item
            name="info"
            active={this.props.activeItem === "info"}
            onClick={() => this.props.handleItemClick('info')}
          >
            <Icon name='info' />
            Как пользоваться
          </Menu.Item> */}
        </Menu>
      </div>
    );
  }
}

export default MyMenu;
