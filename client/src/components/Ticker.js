import React from 'react';

//Class for rendering each individual tickerson portfolio
class Ticker extends React.Component {
  render() {
    return (
      <div>
        {this.props.tickerText}
      </div>
    );
  }
}

export default Ticker;