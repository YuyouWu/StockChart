import React from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';

//Class for rendering each individual tickerson portfolio
class Ticker extends React.Component {
  render() {
    return (
      <ListGroupItem>
        {this.props.tickerText}
      </ListGroupItem>
    );
  }
}

export default Ticker;