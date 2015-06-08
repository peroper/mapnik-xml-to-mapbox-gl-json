var helper = require('./helper.js');

module.exports = {
    minZoom: minZoom,
    maxZoom: maxZoom
}

function minZoom(inputRule) {
	if (inputRule["MaxScaleDenominator"]) {
		var minZoom = helper.scaleDenominatorToZoomLevel(parseInt(inputRule["MaxScaleDenominator"]));
	}

	return minZoom;
}

function maxZoom(inputRule) {
	if (inputRule["MinScaleDenominator"]) {
		var maxZoom = helper.scaleDenominatorToZoomLevel(parseInt(inputRule["MinScaleDenominator"]));
	}

	return maxZoom;

}