import React from 'react';
import { ListGroupItem } from 'reactstrap';
import { Menu } from 'antd';

//Class for rendering each individual tickerson portfolio
class Ticker extends React.Component {
  render() {
    return (
      <Menu.Item key={this.props.key}>
        {this.props.tickerText}
      </Menu.Item>
    );
  }
}

export default Ticker;