
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
import { last, toObject } from "react-stockcharts/lib/utils";

//Interaction
import { TrendLine, FibonacciRetracement, DrawingObjectSelector } from "react-stockcharts/lib/interactive";
import {
	saveInteractiveNodes,
	getInteractiveNodes,
} from "./interactiveutils";

import { Button, ButtonGroup } from "@blueprintjs/core";

const candlesAppearance = {
	wickStroke: function wick(d) {
		return d.close > d.open ? "rgba(0,128,0, 0.8)" : "rgba(255,0,0, 0.8)";
	},
	fill: function fill(d) {
	  return d.close > d.open ? "rgba(0,128,0, 0.8)" : "rgba(255,0,0, 0.8)";
	},
	stroke: function stoke(d) {
		return d.close > d.open ? "rgba(0,128,0, 0.8)" : "rgba(255,0,0, 0.8)";
	},
	candleStrokeWidth: 1,
	widthRatio: 0.8,
	opacity: 1,
}

class CandleStickStockScaleChart extends React.Component {
	constructor(props){
		super(props);
		this.saveNode = this.saveNode.bind(this);
		this.resetYDomain = this.resetYDomain.bind(this);
		this.handleReset = this.handleReset.bind(this);

		this.onKeyPress = this.onKeyPress.bind(this);
		this.onDrawCompleteChart1 = this.onDrawCompleteChart1.bind(this);
		this.handleSelection = this.handleSelection.bind(this);
		this.onFibComplete1 = this.onFibComplete1.bin
		this.saveInteractiveNodes = saveInteractiveNodes.bind(this);
		this.getInteractiveNodes = getInteractiveNodes.bind(this);

		this.saveCanvasNode = this.saveCanvasNode.bind(this);

		this.state = {
			enableTrendLine: false,
			enableFib: false,
			trends_1: [], //for storing drawn trend line
			retracements_1: [] //for storing retracement line
		};

		//Custom chart control
		this.handleTrendLine = this.handleTrendLine.bind(this);
	}

	componentDidMount() {
		document.addEventListener("keyup", this.onKeyPress);
	}
	
	componentWillMount() {
		this.setState({
			suffix: 1
		});
		document.removeEventListener("keyup", this.onKeyPress);
	}

	saveNode(node) {
		this.node = node;
	}

	saveCanvasNode(node) {
		this.canvasNode = node;
	}

	resetYDomain() {
		this.node.resetYDomain();
	}

	handleReset() {
		this.setState({
			suffix: this.state.suffix + 1
		});
	}

	handleSelection(interactives) {
		const state = toObject(interactives, each => {
			return [
				`trends_${each.chartId}`,
				each.objects,
			];
		});
		this.setState(state);
	}

	onDrawCompleteChart1(trends_1) {
		// this gets called on
		// 1. draw complete of trendline
		// 2. drag complete of trendline
		console.log(trends_1);
		this.setState({
			enableTrendLine: false,
			trends_1
		});
	}

	onFibComplete1(retracements_1) {
		this.setState({
			retracements_1,
			enableFib: false
		});
	}

	onKeyPress(e) {
		const keyCode = e.which;
		console.log(keyCode);
		switch (keyCode) {
			case 46: { // DEL

				const trends_1 = this.state.trends_1
					.filter(each => !each.selected);
				if(this.canvasNode){
					this.canvasNode.cancelDrag();
				}		
				this.setState({
					trends_1
				});
				break;
			}
			case 27: { // ESC
				//this.node_1.terminate();
				this.canvasNode.cancelDrag();
				this.setState({
					enableTrendLine: false
				});
				break;
			}
			case 68:   // D - Draw Fib
			case 69: { // E - Enable Fib
				this.setState({
					enableFib: true
				});
				break;
			}
		}
	}

	//Custom chart control
	handleTrendLine() {
		this.setState({
			enableTrendLine: true
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
		var gridWidth = width - 30 - margin.right;

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
			<div>
				<ButtonGroup>
					<Button icon="minus" onClick={this.handleTrendLine}></Button>
				</ButtonGroup>
				<ChartCanvas ref={this.saveCanvasNode} 
					height={window.innerHeight-200}
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
						<CandlestickSeries {...candlesAppearance}/>
						<OHLCTooltip forChart={1} origin={[0, 0]} />
						<ZoomButtons
							onReset={this.handleReset}
						/>
						<TrendLine
							ref={this.saveInteractiveNodes("Trendline", 1)}
							enabled={this.state.enableTrendLine}
							type="RAY"
							snap={false}
							snapTo={d => [d.high, d.low]}
							onStart={() => console.log("START")}
							onComplete={this.onDrawCompleteChart1}
							trends={this.state.trends_1}
						/>
						{/* <FibonacciRetracement
							ref={this.saveInteractiveNodes("FibonacciRetracement", 1)}
							enabled={this.state.enableFib}
							retracements={this.state.retracements_1}
							onComplete={this.onFibComplete1}
						/> */}
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
					<DrawingObjectSelector
						enabled={!this.state.enableTrendLine}
						getInteractiveNodes={this.getInteractiveNodes}
						drawingObjectMap={{
							Trendline: "trends"
						}}
						onSelect={this.handleSelection}
					/>
				</ChartCanvas>
			</div>
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

