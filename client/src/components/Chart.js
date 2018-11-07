
import React from "react";
import PropTypes from "prop-types";

import { ChartCanvas, Chart } from "react-stockcharts";
import {
	CandlestickSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

class CandleStickStockScaleChart extends React.Component {
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

		const gheight = 400;
		const gwidth = 800;

		var margin = {left: 70, right: 70, top:20, bottom: 30};
		var gridHeight = gheight - margin.top - margin.bottom;
		var gridWidth = gwidth - margin.left - margin.right;

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
			<ChartCanvas height={400}
				ratio={ratio}
				width={width}
				margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
				type={type}
				seriesName="MSFT"
				data={data}
				xScale={xScale}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xExtents={xExtents}
			>

				<Chart id={1} yExtents={d => [d.high, d.low]}>
					<XAxis axisAt="bottom" orient="bottom" ticks={6} {...xGrid}/>
					<YAxis axisAt="left" orient="left" ticks={5} {...yGrid}/>
					<CandlestickSeries />
				</Chart>
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

