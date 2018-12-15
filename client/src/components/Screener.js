import React from 'react';
import { HTMLSelect, Button, ButtonGroup } from "@blueprintjs/core";

//Class for rendering each individual tickers on portfolio
class Screener extends React.Component {
  	render() {
	    return (
            <div>
                <p>Market Cap:</p>
                <HTMLSelect>
                    <option value = 'large'> Large </option>
                    <option value = 'mid'> Mid </option>
                    <option value = 'small'> Small </option>
                </HTMLSelect>
            </div>
        );
  	}
}

export default Screener;