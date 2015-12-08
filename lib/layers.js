var _      = require('underscore'),
    filter = require('./filter.js'),
    helper = require('./helper.js'),
    layout = require('./layout.js'),
    paint  = require('./paint.js'),
    zoom   = require('./zoom.js');

module.exports = layers;

function layers(inputXML, settings) {
    var _layers = [];
    var source = 'mapbox';
    if (settings) {
        for (var s in settings.sources) {
            source = s;
        }
    }
    // For each "Rule", build Mapbox layers
    // Can be multiple layers depending on filters
    _.each(inputXML["Layer"], function(inputLayer) {
        _.each(inputLayer["styles"], function(inputStyle) {

            if (_.isArray(inputStyle["Rule"])) {
                _.each(inputStyle["Rule"], function(inputRule) {
                    var layer = buildLayer(inputLayer, inputStyle, inputRule, source);
                    if (layer)
                        _layers.push(layer);
                });
            } else if (inputStyle["Rule"]) {
                var layer = buildLayer(inputLayer, inputStyle, inputStyle["Rule"], source);
                if (layer)
                    _layers.push(layer);
            }
        });
    });
    
    return _layers;
}

/**
 * Builds layer according to Mapbox GL specification
 * https://www.mapbox.com/mapbox-gl-style-spec/#layers
 * @param inputLayer
 * @param inputStyle
 * @param inputRule
 * @returns {{id: string, type: String, source-layer: *}}
 */
function buildLayer(inputLayer, inputStyle, inputRule, source) {
    var _id   = id(inputLayer, inputStyle, inputRule);
    var _type = helper.type(inputRule);
    var _sourceLayer = inputLayer["name"];
    var _paint   = paint(inputRule);
    var _source  = source;
    var _filter  = inputRule["Filter"];
    var _minZoom = zoom.minZoom(inputRule);
    var _maxZoom = zoom.maxZoom(inputRule);

    // Only return if type is not null
    if (_type) {
        var layer = {
            "id": _id,
            "type": _type,
            "source-layer": _sourceLayer,
            "paint": _paint,
            "source": _source,
            "filter": _filter
        };

        // if (_minZoom)
        //     layer["minzoom"] = _minZoom;

        if (_maxZoom)
            layer["maxzoom"] = _maxZoom;

        if (_type == "line")
            layer["layout"] = layoutLine(inputRule);

        if (_type == 'symbol')
            layer["layout"] = layout(inputRule);

        return layer;
    }
}

/**
 * Combines layer, style and filter names into an unique ID
 * @param inputLayer
 * @param inputStyle
 * @param inputRule
 * @returns {string}
 */
function id(inputLayer, inputStyle, inputRule) {

    var id = inputLayer["name"] + "-" + inputStyle["name"];

    // Add filter name to ID if exists
    if (inputRule.hasOwnProperty("Filter")) {
        _.each(inputRule.Filter, function(filter) {
            id += "-" + filter;
        });
    }

    // Layers can get same ID if filters are the same. This is used to get unique IDs.
    /*
    if (inputRule["MaxScaleDenominator"])
        id += "-" + helper.scaleDenominatorToZoomLevel(parseInt(inputRule["MaxScaleDenominator"]));
    if (inputRule["MinScaleDenominator"])
        id += "-" + helper.scaleDenominatorToZoomLevel(parseInt(inputRule["MinScaleDenominator"]));
    */

    return id;
}


function layoutLine(inputRule) {
    var inputLine = inputRule["LineSymbolizer"];
    var layout = {}

    if (inputLine["stroke-linecap"]) {
        layout["line-cap"] = inputLine["stroke-linecap"];
    }
    
    if (inputLine["stroke-linejoin"]) {
        layout["line-join"] = inputLine["stroke-linejoin"];
    }

    return layout;
}
