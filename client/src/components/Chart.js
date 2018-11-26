
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
import { 
	TrendLine, 
	EquidistantChannel,
	FibonacciRetracement, 
	StandardDeviationChannel,
	GannFan, 
	DrawingObjectSelector } from "react-stockcharts/lib/interactive";
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
		this.onDrawComplete = this.onDrawComplete.bind(this);
		this.onEqChannelComplete = this.onEqChannelComplete.bind(this);
		this.onStdChannelComplete = this.onStdChannelComplete.bind(this);
		this.onFibComplete = this.onFibComplete.bind(this);
	    this.onFanComplete = this.onFanComplete.bind(this);

		this.handleSelection = this.handleSelection.bind(this);

		this.saveInteractiveNodes = saveInteractiveNodes.bind(this);
		this.getInteractiveNodes = getInteractiveNodes.bind(this);

		this.saveCanvasNode = this.saveCanvasNode.bind(this);

		this.state = {
			enableTrendLine: false,
			trends_1: [],
			enableFib: false,
			retracements_1: [],
			enableFans: false,
			fans: [],
			enableEqChannel: false,
			channels_1: [],
			enableStdChannel: false,
			stdchannels: []
		};

		//Custom chart control
		this.handleTrendLine = this.handleTrendLine.bind(this);
		this.handleFib = this.handleFib.bind(this);
		this.handleFan = this.handleFan.bind(this);
		this.handleEqChannel = this.handleEqChannel.bind(this);
		this.handleStdChannel = this.handleStdChannel.bind(this);
		this.handleClearDrawings = this.handleClearDrawings.bind(this);
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

	saveInteractiveNode(node) {
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

	handleSelection(interactives) {
		//console.log(interactives)
		if (interactives[0].type === "Trendline") {
		  const state = toObject([interactives[0]], each => {
			return [`trends_${each.chartId}`, each.objects];
		  });
		  this.setState(state);
		}
		if (interactives[1].type === "EquidistantChannel") {
			const state = toObject([interactives[1]], each => {
			  return [`channels_${each.chartId}`, each.objects];
			});
			this.setState(state);
		}
		if (interactives[2].type === "StandardDeviationChannel") {
			const state = toObject([interactives[2]], each => {
			  return ["stdchannels", each.objects];
			});
			this.setState(state);
		}
		if (interactives[3].type === "FibonacciRetracement") {
		  const state = toObject([interactives[3]], each => {
			return [`retracements_${each.chartId}`, each.objects];
		  });
		  this.setState(state);
		}
		if (interactives[4].type === "GannFan") {
		  const state = toObject([interactives[4]], each => {
			return ["fans", each.objects];
		  });
		  this.setState(state);
		}
	}

	onDrawComplete(trends_1) {
		this.setState({
		  enableTrendLine: false,
		  trends_1
		});
	}
	onEqChannelComplete(channels_1) {
		this.setState({
			enableEqChannel: false,
			channels_1
		});
	}
	onStdChannelComplete(stdchannels) {
		this.setState({
			enableStdChannel: false,
			stdchannels
		});
	}
	onFibComplete(retracements_1) {
		this.setState({
		  retracements_1,
		  enableFib: false
		});
	}
	
	onFanComplete(fans) {
		this.setState({
		  enableFans: false,
		  fans
		});
	}

	onKeyPress(e) {
		const keyCode = e.which;
		console.log(keyCode);
		switch (keyCode) {
			case 46: { // DEL

				const trends_1 = this.state.trends_1.filter(each => !each.selected);
				const retracements_1 = this.state.retracements_1.filter(
				  each => !each.selected
				);
				const channels_1 = this.state.channels_1.filter(
					each => !each.selected
				);
				const stdchannels = this.state.stdchannels.filter(
					each => !each.selected
				);
				const fans = this.state.fans.filter(each => !each.selected);
				if(this.canvasNode){
					this.canvasNode.cancelDrag();
				}
				this.setState({
				  trends_1,
				  channels_1,
				  stdchannels,
				  retracements_1,
				  fans
				});
				break;
			}
			case 27: { // ESC
				if(this.canvasNode){
					this.canvasNode.cancelDrag();
				}
				this.setState({
					enableTrendLine: false,
					enableEqChannel: false,
					enableStdChannel: false,
					enableFib: false,
					enableFans: false
				});
				break;
			}

			default: {
				this.setState({
					enableTrendLine: false,
					enableEqChannel: false,
					enableStdChannel: false,
					enableFib: false,
					enableFans: false
				});
			}
		}
	}

	//Custom chart control
	handleTrendLine() {
		this.setState({
			enableTrendLine: true
		});
	}
	handleEqChannel() {
		this.setState({
			enableEqChannel: true
		});
	}
	handleStdChannel() {
		this.setState({
			enableStdChannel: true
		});
	}
	handleFib(){
		this.setState({
			enableFib: true
		});
	}
	handleFan(){
		this.setState({
			enableFans: true
		});
	}
	handleClearDrawings(){
		this.setState({
			enableTrendLine: false,
			trends_1: [],
			enableFib: false,
			retracements_1: [],
			enableFans: false,
			fans: [],
			enableEqChannel: false,
			channels_1: [],
			enableStdChannel: false,
			stdchannels: []
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
					<Button icon="vertical-distribution" onClick={this.handleEqChannel}></Button>
					<Button icon="menu" onClick={this.handleStdChannel}></Button>
					<Button icon="align-justify" onClick={this.handleFib}></Button>
					<Button icon="curved-range-chart" onClick={this.handleFan}></Button>
					<Button icon="cross" onClick={this.handleClearDrawings}></Button>
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
							type="LINE"
							snap={false}
							snapTo={d => [d.high, d.low]}
							trends={this.state.trends_1}
							onComplete={this.onDrawComplete}
						/>
						<EquidistantChannel
							ref={this.saveInteractiveNodes("EquidistantChannel", 1)}
							enabled={this.state.enableEqChannel}
							onComplete={this.onEqChannelComplete}
							channels={this.state.channels_1}
						/>
						<StandardDeviationChannel
							ref={this.saveInteractiveNodes("StandardDeviationChannel", 1)}
							enabled={this.state.enableStdChannel}
							onComplete={this.onStdChannelComplete}
							channels={this.state.stdchannels}
						/>
						<FibonacciRetracement
							ref={this.saveInteractiveNodes("FibonacciRetracement", 1)}
							enabled={this.state.enableFib}
							retracements={this.state.retracements_1}
							onComplete={this.onFibComplete}
						/>

						<GannFan
							ref={this.saveInteractiveNodes("GannFan", 1)}
							enabled={this.state.enableFans}
							onStart={() => console.log("START")}
							onComplete={this.onFanComplete}
							fans={this.state.fans}
						/>
					</Chart>
					<DrawingObjectSelector
						enabled={
						!(
							this.state.enableTrendLine &&
							this.state.enableEqChannel &&
							this.state.enableStdChannel &&
							this.state.enableFib &&
							this.state.enableFans
						)
						}
						getInteractiveNodes={this.getInteractiveNodes}
						drawingObjectMap={{
						FibonacciRetracement: "retracements",
						EquidistantChannel: "channels",
						StandardDeviationChannel: "channels",
						Trendline: "trends",
						GannFan: "fans"
						}}
						onSelect={this.handleSelection}
					/>

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
	type: "hybrid",
};
CandleStickStockScaleChart = fitWidth(CandleStickStockScaleChart);

export default CandleStickStockScaleChart;

