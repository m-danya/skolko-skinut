import React from "react";
import { isMobile } from "react-device-detect";
import { Menu, Icon } from "semantic-ui-react";
/* global VK */

class VkGroup extends React.Component {
  componentDidMount() {
  
    // VK.Widgets.Group("vk_groups", { mode: 3, width: "250" }, 202786086);
  }

  render() {
    return (
      <div></div>
        // <div
        //   id="vk_groups"
        //   className='centeredButton'/>
          // className={isMobile ? 'centeredButton' : ' '}/>
    );
  }
}

export default VkGroup;
