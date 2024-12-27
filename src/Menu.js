import React from "react";
import { isMobile } from "react-device-detect";
import { Menu, Icon } from "semantic-ui-react";

class MyMenu extends React.Component {
  render() {
    return (
      <div
        style={
          isMobile
            ? {
                paddingBottom: "15px",
                width: "100%!important",
                textAlign: "center",
              }
            : {}
        }
      >
        <Menu
          //inverted
          //stackable
          compact={isMobile}
          className="centeredButton"
          borderless
          //fluid
          //vertical
          style={{ fontSize: "14px" }}
        >
          <Menu.Item
            className={isMobile ? "centeredButton" : ""}
            name="main"
            active={this.props.activeItem === "main"}
            onClick={() => this.props.handleItemClick("main")}
          >
            <Icon
              name="content"
              style={{
                paddingTop: "1.5px",
              }}
            />
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
            className={isMobile ? "centeredButton" : ""}
            name="products"
            disabled={!this.props.hasId}
            active={this.props.activeItem === "products"}
            onClick={() => this.props.handleItemClick("products")}
          >
            <Icon
              name="calculator"
              color="black"
              style={{
                paddingTop: "1.5px",
              }}
            />
            Продукты
          </Menu.Item>

          {/* <Menu.Item
            name="login"
            className={isMobile?"centeredButton":""}
            active={this.props.activeItem === "login"}
            onClick={() => this.props.handleItemClick('login')}
          >
            <Icon name='vk' style={{
              paddingTop: "1.5px",
            }}/>Войти
          </Menu.Item> */}

          <Menu.Item
            name="login"
            className={isMobile ? "centeredButton" : ""}
            active={this.props.activeItem === "donate"}
            onClick={() => this.props.handleItemClick("donate")}
          >
            <Icon
              name="coffee"
              style={{
                paddingTop: "1.5px",
                paddingRight: "20px",
              }}
            />
            Поддержать
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
