
import React from "react";
import PropTypes from "prop-types";

import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart, ZoomButtons } from "react-stockcharts";
import { BarSeries, CandlestickSeries, LineSeries, RSISeries, MACDSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
	CrossHairCursor,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { OHLCTooltip, MovingAverageTooltip, RSITooltip, MACDTooltip } from "react-stockcharts/lib/tooltip";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last, toObject } from "react-stockcharts/lib/utils";

//Indicator
import { ema, wma, sma, tma, rsi, macd } from "react-stockcharts/lib/indicator";

//Interaction
import {
	TrendLine,
	EquidistantChannel,
	FibonacciRetracement,
	StandardDeviationChannel,
	GannFan,
	DrawingObjectSelector
} from "react-stockcharts/lib/interactive";
import {
	saveInteractiveNodes,
	getInteractiveNodes,
} from "./interactiveutils";


import { Button, ButtonGroup, Tooltip, Popover, Menu, MenuItem, MenuDivider, Position } from "@blueprintjs/core";
import { Layout, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { newDrawingAction } from '../actions/chartActions';
import { getOneTicker } from '../actions/portfolioActions';

const { Sider, Content } = Layout;

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
	widthRatio: 0.6,
	opacity: 1,
}

const macdAppearance = {
	stroke: {
		macd: "#FF0000",
		signal: "#00F300",
	},
	fill: {
		divergence: "#4682B4"
	},
};

class CandleStickStockScaleChart extends React.Component {
	constructor(props) {
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
			trends: [],
			enableFib: false,
			retracements: [],
			enableFans: false,
			fans: [],
			enableEqChannel: false,
			channels: [],
			enableStdChannel: false,
			stdchannels: [],
			currentTickerId: this.props.tickerId,
			loading: true,
			showMACD: false,
			showRSI: false
		};

		//Custom chart control
		this.handleTrendLine = this.handleTrendLine.bind(this);
		this.handleFib = this.handleFib.bind(this);
		this.handleFan = this.handleFan.bind(this);
		this.handleEqChannel = this.handleEqChannel.bind(this);
		this.handleStdChannel = this.handleStdChannel.bind(this);
		this.handleClearDrawings = this.handleClearDrawings.bind(this);
		this.toggleMACD = this.toggleMACD.bind(this);
		this.toggleRSI = this.toggleRSI.bind(this);
	}

	componentDidMount() {
		document.addEventListener("keyup", this.onKeyPress);
	}

	componentWillMount() {
		this.loadDrawings();
		this.setState({
			suffix: 1
		});
		document.removeEventListener("keyup", this.onKeyPress);
	}

	//Not called at all?
	componentWillReceiveProps(newProps) {
		this.setState({
			currentTickerId: newProps.tickerId
		});
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

	loadDrawings() {
		if (this.state.currentTickerId && this.state.currentTickerId !== '0') {
			this.props.getOneTicker(this.state.currentTickerId).then(res => {
				if (res.payload.ticker.trend) {
					this.setState({
						trends: res.payload.ticker.trend
					});
				}

				if (res.payload.ticker.channel) {
					this.setState({
						channels: res.payload.ticker.channel
					});
				}

				if (res.payload.ticker.stdchannel) {
					this.setState({
						stdchannels: res.payload.ticker.stdchannel
					});
				}

				if (res.payload.ticker.retracement) {
					this.setState({
						retracements: res.payload.ticker.retracement
					});
				}

				if (res.payload.ticker.fan) {
					this.setState({
						fans: res.payload.ticker.fan
					});
				}
			});
		}
	}

	saveDrawings() {
		if (this.state.currentTickerId && this.state.currentTickerId !== '0') {
			var drawingObj = {
				_id: this.state.currentTickerId,
				drawing: this.state.trends,
				drawingName: 'trend'
			}
			this.props.newDrawingAction(drawingObj);

			drawingObj = {
				_id: this.state.currentTickerId,
				drawing: this.state.channels,
				drawingName: 'channel'
			}
			this.props.newDrawingAction(drawingObj);

			drawingObj = {
				_id: this.state.currentTickerId,
				drawing: this.state.stdchannels,
				drawingName: 'stdchannel'
			}
			this.props.newDrawingAction(drawingObj);

			drawingObj = {
				_id: this.state.currentTickerId,
				drawing: this.state.retracements,
				drawingName: 'retracement'
			}
			this.props.newDrawingAction(drawingObj);

			drawingObj = {
				_id: this.state.currentTickerId,
				drawing: this.state.fans,
				drawingName: 'fan'
			}
			this.props.newDrawingAction(drawingObj);
		}
	}

	handleSelection(interactives) {
		//console.log(interactives)
		if (interactives[0].type === "Trendline") {
			const state = toObject([interactives[0]], each => {
				return [`trends`, each.objects];
			});
			this.setState(state);
		}
		if (interactives[1].type === "EquidistantChannel") {
			const state = toObject([interactives[1]], each => {
				return [`channels`, each.objects];
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
				return [`retracements`, each.objects];
			});
			this.setState(state);
		}
		if (interactives[4].type === "GannFan") {
			const state = toObject([interactives[4]], each => {
				return ["fans", each.objects];
			});
			this.setState(state);
		}

		this.saveDrawings();
	}

	onDrawComplete(trends) {
		this.setState({
			enableTrendLine: false,
			trends
		}, () => {
			var drawingObj = {
				_id: this.state.currentTickerId,
				drawing: trends,
				drawingName: 'trend'
			}
			this.props.newDrawingAction(drawingObj).then(res => {
				console.log(res);
			});
		});
	}
	onEqChannelComplete(channels) {
		this.setState({
			enableEqChannel: false,
			channels
		}, () => {
			var drawingObj = {
				_id: this.state.currentTickerId,
				drawing: channels,
				drawingName: 'channel'
			}
			this.props.newDrawingAction(drawingObj).then(res => {
				console.log(res);
			});
		});
	}
	onStdChannelComplete(stdchannels) {
		this.setState({
			enableStdChannel: false,
			stdchannels
		}, () => {
			var drawingObj = {
				_id: this.state.currentTickerId,
				drawing: stdchannels,
				drawingName: 'stdchannel'
			}
			this.props.newDrawingAction(drawingObj).then(res => {
				console.log(res);
			});
		});
	}
	onFibComplete(retracements) {
		this.setState({
			retracements,
			enableFib: false
		}, () => {
			var drawingObj = {
				_id: this.state.currentTickerId,
				drawing: retracements,
				drawingName: 'retracement'
			}
			this.props.newDrawingAction(drawingObj).then(res => {
				console.log(res);
			});
		});
	}

	onFanComplete(fans) {
		this.setState({
			enableFans: false,
			fans
		}, () => {
			var drawingObj = {
				_id: this.state.currentTickerId,
				drawing: fans,
				drawingName: 'fan'
			}
			this.props.newDrawingAction(drawingObj).then(res => {
				console.log(res);
			});
		});
	}

	onKeyPress(e) {
		const keyCode = e.which;
		//console.log(keyCode);
		switch (keyCode) {
			case 46: { // DEL

				const trends = this.state.trends.filter(each => !each.selected);
				const retracements = this.state.retracements.filter(
					each => !each.selected
				);
				const channels = this.state.channels.filter(
					each => !each.selected
				);
				const stdchannels = this.state.stdchannels.filter(
					each => !each.selected
				);
				const fans = this.state.fans.filter(each => !each.selected);
				if (this.canvasNode) {
					this.canvasNode.cancelDrag();
				}
				this.setState({
					trends,
					channels,
					stdchannels,
					retracements,
					fans
				}, () => {
					this.saveDrawings();
				});
				break;
			}
			case 27: { // ESC
				if (this.canvasNode) {
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
	handleFib() {
		this.setState({
			enableFib: true
		});
	}
	handleFan() {
		this.setState({
			enableFans: true
		});
	}
	handleClearDrawings() {
		this.setState({
			enableTrendLine: false,
			trends: [],
			enableFib: false,
			retracements: [],
			enableFans: false,
			fans: [],
			enableEqChannel: false,
			channels: [],
			enableStdChannel: false,
			stdchannels: []
		}, () => {
			var drawingObj = {
				_id: this.state.currentTickerId,
				drawing: this.state.trends,
				drawingName: 'trend'
			}
			this.props.newDrawingAction(drawingObj);

			drawingObj = {
				_id: this.state.currentTickerId,
				drawing: this.state.channels,
				drawingName: 'channel'
			}
			this.props.newDrawingAction(drawingObj);

			drawingObj = {
				_id: this.state.currentTickerId,
				drawing: this.state.stdchannels,
				drawingName: 'stdchannel'
			}
			this.props.newDrawingAction(drawingObj);

			drawingObj = {
				_id: this.state.currentTickerId,
				drawing: this.state.retracements,
				drawingName: 'retracement'
			}
			this.props.newDrawingAction(drawingObj);

			drawingObj = {
				_id: this.state.currentTickerId,
				drawing: this.state.fans,
				drawingName: 'fan'
			}
			this.props.newDrawingAction(drawingObj);
		});
	}


	//Indicator Control
	toggleMACD() {
		this.setState(prevState => ({
			showMACD: !prevState.showMACD
		}));
	}

	toggleRSI() {
		this.setState(prevState => ({
			showRSI: !prevState.showRSI
		}));
	}

	render() {
		const { type, data: initialData, width, ratio } = this.props;

		//Indicator
		//EMA
		const ema20 = ema()
			.options({
				windowSize: 20, // optional will default to 10
				sourcePath: "close", // optional will default to close as the source
			})
			.skipUndefined(true) // defaults to true
			.merge((d, c) => { d.ema20 = c; }) // Required, if not provided, log a error
			.accessor(d => d.ema20) // Required, if not provided, log an error during calculation
			.stroke("blue"); // Optional

		//RSI
		const rsiCalculator = rsi()
			.options({ windowSize: 14 })
			.merge((d, c) => { d.rsi = c; })
			.accessor(d => d.rsi);

		const macdCalculator = macd()
			.options({
				fast: 12,
				slow: 26,
				signal: 9,
			})
			.merge((d, c) => { d.macd = c; })
			.accessor(d => d.macd);


		const calculatedData = ema20(rsiCalculator(macdCalculator(initialData)));

		const xScaleProvider = discontinuousTimeScaleProvider
			.inputDateAccessor(d => d.date);
		const {
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		} = xScaleProvider(calculatedData);

		const xExtents = [
			xAccessor(last(data)),
			xAccessor(data[data.length - 100])
		];

		const gheight = window.innerHeight - 200;

		var margin = { left: 70, right: 70, top: 20, bottom: 30 };
		var gridHeight = gheight - margin.top - margin.bottom;
		var gridWidth = width - 80 - margin.right;

		var bottomMargin = 100;
		var rsiHeight = this.state.showRSI ? 100 : 0;
		var macdHeight = this.state.showMACD ? 100 : 0;
		var volHeight = 100;
		var stockchartHeight = window.innerHeight - 170 - (bottomMargin + rsiHeight + macdHeight);
		// var stockchartHeight = 500;

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
				<Layout>
					{/* <Sider width={30} style={{ background: '#fff' }}>
						<ButtonGroup vertical style={{ marginTop: '0px' }}>
							<Button icon="minus" onClick={this.handleTrendLine}></Button>
							<Button icon="vertical-distribution" onClick={this.handleEqChannel}></Button>
							<Button icon="menu" onClick={this.handleStdChannel}></Button>
							<Button icon="align-justify" onClick={this.handleFib}></Button>
							<Button icon="curved-range-chart" onClick={this.handleFan}></Button>
							<Button icon="cross" onClick={this.handleClearDrawings}></Button>
						</ButtonGroup>
					</Sider> */}
					<Layout style={{ background: '#fff' }}>

						<Row>
							<ButtonGroup style={{ marginRight: '10px' }}>
								<Tooltip
									content={<p>Trend Line</p>}
									position={Position.BOTTOM}
									usePortal={false}
								>

									<Button icon="minus" onClick={this.handleTrendLine}></Button>
								</Tooltip>
								<Tooltip
									content={<p>Channel</p>}
									position={Position.BOTTOM}
									usePortal={false}
								>
									<Button icon="vertical-distribution" onClick={this.handleEqChannel}></Button>
								</Tooltip>
								<Tooltip
									content={<p>Standard Deviation</p>}
									position={Position.BOTTOM}
									usePortal={false}
								>
									<Button icon="menu" onClick={this.handleStdChannel}></Button>
								</Tooltip>
								<Tooltip
									content={<p>Fibonacci Retracement</p>}
									position={Position.BOTTOM}
									usePortal={false}
								>
									<Button icon="align-justify" onClick={this.handleFib}></Button>
								</Tooltip>
								<Tooltip
									content={<p>Gann Fan</p>}
									position={Position.BOTTOM}
									usePortal={false}
								>
									<Button icon="curved-range-chart" onClick={this.handleFan}></Button>
								</Tooltip>
								<Tooltip
									content={<p>Clear All Drawings</p>}
									position={Position.BOTTOM}
									usePortal={false}
								>
									<Button icon="cross" onClick={this.handleClearDrawings}></Button>
								</Tooltip>
							</ButtonGroup>

							<ButtonGroup style={{ marginRight: '10px' }}>
								<Popover
									content={
										<Menu>
											<MenuItem text='SMA'></MenuItem>
											<MenuItem text='EMA'></MenuItem>
											<MenuDivider />
											<MenuItem 
												text='RSI'
												onClick={this.toggleRSI}
											/>
											<MenuItem
												text='MACD'
												onClick={this.toggleMACD}
											/>
										</Menu>
									}
									position={Position.BOTTOM}
								>
									<Tooltip
										content={<p>Indicators</p>}
										position={Position.BOTTOM}
										usePortal={false}
									>
										<Button icon="timeline-line-chart"></Button>
									</Tooltip>
								</Popover>
							</ButtonGroup>
						</Row>

						<Content style={{ background: '#fff', borderStyle: "solid", borderWidth: '1px', borderRadius: '5px', borderColor: '#DADADA' }} >
							<ChartCanvas
								ref={this.saveCanvasNode}
								height={window.innerHeight - 230}
								ratio={ratio}
								width={width - 50}
								margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
								type={type}
								seriesName={`TICKER_${this.state.suffix}`}
								data={data}
								xScale={xScale}
								xAccessor={xAccessor}
								displayXAccessor={displayXAccessor}
								xExtents={xExtents}
							>

								<Chart
									id={1}
									height={stockchartHeight}
									yExtents={[d => [d.high, d.low - d.low * 0.1], ema20.accessor()]}
								>
									<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} {...xGrid} />
									<YAxis axisAt="right" orient="right" ticks={10} {...yGrid} />
									<MouseCoordinateY
										at="right"
										orient="right"
										displayFormat={format(".2f")}
									/>
									<CandlestickSeries {...candlesAppearance} />

									<LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()} />
									<CurrentCoordinate yAccessor={ema20.accessor()} fill={ema20.stroke()} />

									<OHLCTooltip forChart={1} origin={[-38, 0]} />
									<ZoomButtons
										onReset={this.handleReset}
									/>
									<MovingAverageTooltip
										onClick={(e) => {
											console.log(e);
											console.log(this.state.currentTickerId);
										}}
										origin={[-38, 15]}
										options={[
											{
												yAccessor: ema20.accessor(),
												type: "EMA",
												stroke: ema20.stroke(),
												windowSize: ema20.options().windowSize,
												echo: "some echo here",
											}
										]}
									/>
									<TrendLine
										ref={this.saveInteractiveNodes("Trendline", 1)}
										enabled={this.state.enableTrendLine}
										type="LINE"
										snap={false}
										snapTo={d => [d.high, d.low]}
										trends={this.state.trends}
										onComplete={this.onDrawComplete}
									/>
									<EquidistantChannel
										ref={this.saveInteractiveNodes("EquidistantChannel", 1)}
										enabled={this.state.enableEqChannel}
										onComplete={this.onEqChannelComplete}
										channels={this.state.channels}
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
										retracements={this.state.retracements}
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
									height={volHeight}
									yExtents={d => d.volume}
									origin={(w, h) => [0, h - (rsiHeight + macdHeight + bottomMargin)]}
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
								{this.state.showRSI ? (
									<Chart id={3}
										yExtents={[0, 100]}
										height={rsiHeight}
										origin={(w, h) => [0, h - (macdHeight + bottomMargin)]}
									>
										<XAxis axisAt="bottom" orient="bottom" showTicks={false} />
										<YAxis axisAt="right"
											orient="right"
											tickValues={[30, 50, 70]} />
										<MouseCoordinateY
											at="right"
											orient="right"
											displayFormat={format(".2f")} />

										<RSISeries yAccessor={d => d.rsi} />

										<RSITooltip origin={[-38, 15]}
											yAccessor={d => d.rsi}
											options={rsiCalculator.options()} />
									</Chart>

								) : (
									<div></div>
								)}
								{this.state.showMACD ? (
									<Chart id={4} height={macdHeight}
										yExtents={macdCalculator.accessor()}
										origin={(w, h) => [0, h - bottomMargin]} padding={{ top: 10, bottom: 10 }}
									>
										<XAxis axisAt="bottom" orient="bottom" />
										<YAxis axisAt="right" orient="right" ticks={2} />

										<MouseCoordinateX
											at="bottom"
											orient="bottom"
											displayFormat={timeFormat("%Y-%m-%d")}
											rectRadius={5}
										/>
										<MouseCoordinateY
											at="right"
											orient="right"
											displayFormat={format(".2f")}
										/>

										<MACDSeries yAccessor={d => d.macd}
											{...macdAppearance} />
										<MACDTooltip
											origin={[-38, 15]}
											yAccessor={d => d.macd}
											options={macdCalculator.options()}
											appearance={macdAppearance}
										/>
									</Chart>
								) : (
									<div></div>
								)}
								<CrossHairCursor />
							</ChartCanvas>
						</Content>
					</Layout>
				</Layout>
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

const mapStateToProps = state => ({});
export default connect(mapStateToProps, { newDrawingAction, getOneTicker })(CandleStickStockScaleChart);

