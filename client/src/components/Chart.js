
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart, ZoomButtons } from "react-stockcharts";
import { BarSeries, CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	MouseCoordinateX,
	MouseCoordinateY
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

class CandleStickStockScaleChart extends React.Component {
	constructor(props){
		super(props);
		this.saveNode = this.saveNode.bind(this);
		this.resetYDomain = this.resetYDomain.bind(this);
		this.handleReset = this.handleReset.bind(this);
	}

	componentWillMount() {
		this.setState({
			suffix: 1
		});
	}

	saveNode(node) {
		this.node = node;
	}
	resetYDomain() {
		this.node.resetYDomain();
	}
	handleReset() {
		this.setState({
			suffix: this.state.suffix + 1
		});
	}

	render() {
		const { type, data: initialData, width, ratio } = this.props;

		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(initialData);
		const xExtents = [
			xAccessor(last(data)),
			xAccessor(data[data.length - 100])
		];

		const gheight = window.innerHeight-200;

		var margin = {left: 70, right: 70, top:20, bottom: 30};
		var gridHeight = gheight - margin.top - margin.bottom;
		var gridWidth = width - margin.left - margin.right;

		var showGrid = true;
		var yGrid = showGrid ? { 
		    innerTickSize: -1 * gridWidth,
		    tickStrokeDasharray: 'Solid',
		    tickStrokeOpacity: 0.2,
		    tickStrokeWidth: 1
		} : {};
		var xGrid = showGrid ? { 
		    innerTickSize: -1 * gridHeight,
		    tickStrokeDasharray: 'Solid',
		    tickStrokeOpacity: 0.2,
		    tickStrokeWidth: 1
		} : {};

		return (
			<ChartCanvas ref={this.saveNode} height={window.innerHeight-200}
				ratio={ratio}
				width={width}
				margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
				type={type}
				seriesName={`TICKER_${this.state.suffix}`}
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>

				<Chart id={1} yExtents={d => [d.high, d.low]}>
					<XAxis axisAt="bottom" orient="bottom" ticks={10} {...xGrid}/>
					<YAxis axisAt="right" orient="right" ticks={10} {...yGrid}/>
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")}
					/>
					<CandlestickSeries />
					<OHLCTooltip forChart={1} origin={[0, 0]} />
					<ZoomButtons
						onReset={this.handleReset}
					/>
				</Chart>
				<Chart
					id={2}
					height={100}
					yExtents={d => d.volume}
					origin={(w, h) => [0, h - 100]}
				>
					<YAxis
						axisAt="left"
						orient="left"
						ticks={5}
						tickFormat={format(".2s")}
					/>

					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d")}
					/>
					<MouseCoordinateY
						at="left"
						orient="left"
						displayFormat={format(".4s")}
					/>

					<BarSeries
						yAccessor={d => d.volume}
						fill={d => (d.close > d.open ? "#6BA583" : "#FF0000")}
					/>
				</Chart>
				<CrossHairCursor />
			</ChartCanvas>
		);
	}
}

CandleStickStockScaleChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickStockScaleChart.defaultProps = {
	type: "svg",
};
CandleStickStockScaleChart = fitWidth(CandleStickStockScaleChart);

export default CandleStickStockScaleChart;

