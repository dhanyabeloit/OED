/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { connect } from 'react-redux';
import ExportComponent from '../components/ExportComponent';
import { chartTypes } from '../reducers/graph';
import { DATA_TYPE_GROUP, DATA_TYPE_METER } from '../utils/Datasources';

/**
 * @param {State} state
 * @return {{meterInfo: *, selectedMeters: Array}}
 */
function mapStateToProps(state) {
	const timeInterval = state.graph.timeInterval;
	const data = { datasets: [] };
	let readingsData;
	const chart = state.graph.chartToRender;
	const barDuration = state.graph.barDuration;

	for (const datasourceID of state.graph.selectedDatasources) {
		// Extract state info into datasets props. Doesn't work for groups right now! TODO TODO
		if (datasourceID.type === DATA_TYPE_GROUP) {
			console.error('UNIMPLEMENTED: mapStateToProps for ExportContainer cannot handle groups.');
		} else if (datasourceID.type === DATA_TYPE_METER) {
			const meterID = datasourceID.id;
			if (chart === chartTypes.line) {
				readingsData = state.readings.line.byMeterID[meterID][timeInterval];
			}		else if (chart === chartTypes.bar) { readingsData = state.readings.bar.byMeterID[meterID][timeInterval][barDuration]; }
			if (readingsData !== undefined && !readingsData.isFetching && chart === chartTypes.line) {
				data.datasets.push({
					label: state.meters.byMeterID[meterID].name,
					id: state.meters.byMeterID[meterID].id,
					timestamp: state.readings.line.byMeterID[meterID][timeInterval].start_timestamp,
					currentChart: chart,
					exportVals: state.readings.line.byMeterID[meterID][timeInterval].readings.map(arr => ({ x: arr[0], y: arr[1] }))
				});
			} else if (readingsData !== undefined && !readingsData.isFetching && chart === chartTypes.bar) {
				data.datasets.push({
					label: state.meters.byMeterID[meterID].name,
					id: state.meters.byMeterID[meterID].id,
					timestamp: state.readings.bar.byMeterID[meterID][timeInterval][barDuration].timestamp,
					currentChart: chart,
					exportVals: state.readings.bar.byMeterID[meterID][timeInterval][barDuration].readings.map(arr => ({ x: arr[0], y: arr[1] }))
				});
			}
		}
	}
	return {
		selectedMeters: state.graph.selectedMeters,
		exportVals: data
	};
}

/**
 * Connects changes to the Redux store to UIOptionsComponent via mapStateToProps
 */
export default connect(mapStateToProps)(ExportComponent);
