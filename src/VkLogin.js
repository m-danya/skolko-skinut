import React from "react";
import { isMobile } from "react-device-detect";
import { Menu, Icon } from "semantic-ui-react";
import VkGroup from "./VkGroup";
/* global VK */

class VkLogin extends React.Component {
  componentDidMount() {
    VK.Widgets.Auth("vk_auth", {
      onAuth: (r) => {
        console.log(r)
        this.props.updatePersonalData(r)
      },
      authUrl: '/',
      width: "250"
    })
    VK.Widgets.Like("vk_like", { type: "full" });
  }

  render() {
    return (
      <div>
        {!this.props.personalData && <div
          id="vk_auth"
          style={{
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        />}
        {this.props.personalData &&
          <div>
            {`Привет, ${this.props.personalData.first_name} ${this.props.personalData.last_name}!`}
             <br />
            {/*<br /> */}
          {/* В будущем можно будет смотреть список своих проектов, а пока что ты можешь поставить нам лайк авансом :)
          <br />
            <br />

            <div id="vk_like"></div> */}
            <br />
            Скоро здесь можно будет посмотреть <b>список своих проектов</b>, а пока что можешь подписаться на нас ВКонтакте, чтобы быть в курсе всех новостей проекта: 
            <br />
            <br />
            <VkGroup />
          </div>
        }
      </div>
    );
  }
}

export default VkLogin;
