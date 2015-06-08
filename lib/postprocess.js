var _ = require('underscore');

module.exports = postprocess;

var layers = {};

/**
 * Group all layers if they have the same filter
 * @param outputJSON
 */
function postprocess(outputJSON) {
    _.forEach(outputJSON["layers"], function(layer) {
        // If no filter, just add them
        if (!layer["filter"])
            layers[JSON.stringify(layer)] = layer;
        else {
            // Check if layer with similar properties already exists in layers, if it does, merge. If not
            // just add it
            if (layers[layer["id"]])
                mergeLayer(layers[layer["id"]], layer);
            else
                layers[layer["id"]] = layer;

        }
    });

    //Replace stops with correct value if stops only contain one value
    _.forEach(layers, function(layer, index, list) {

        //Text size of symbols
        try {
            if (layer["paint"]["text-size"]["stops"].length == 1) {
                //console.log("symbols: " + layer["paint"]["text-size"]["stops"][0][1]);
                list[index]["paint"]["text-size"] = parseFloat(layer["paint"]["text-size"]["stops"][0][1]);
            }
        }
        catch (error) {
            //console.log(error);
        }

        //Line width of lines
        try {
            if (layer["paint"]["line-width"]["stops"].length == 1) {
                //console.log("lines: " + layer["paint"]["line-width"]["stops"][0][1]);
                list[index]["paint"]["line-width"] = parseFloat(layer["paint"]["line-width"]["stops"][0][1]);
            }
        }
        catch (error) {
            //console.log(error);
        }

        //Fill color of fills/polygons
        try {
            if (layer["paint"]["fill-color"]["stops"].length == 1) {
                //console.log("fill: " + layer["paint"]["fill-color"]["stops"][0][1]);
                list[index]["paint"]["fill-color"] = layer["paint"]["fill-color"]["stops"][0][1];
            }
        }
        catch(error) {
            //console.log(error);
        }

    });

    outputJSON.layers = _.map(layers, function(value, key){ return value; });
}


/**
 * Merges newLayer with originLayer, adding it's stop
 * TODO: Merge other things than stops
 * @param originLayer
 * @param newLayer
 */
function mergeLayer(originLayer, newLayer) {

    //Merge layers of type fill
    if (originLayer["type"] == "fill") {
        originLayerStops = originLayer["paint"]["fill-color"]["stops"];
        newLayerStops = newLayer["paint"]["fill-color"]["stops"];

        originLayerStops = combineStops(originLayerStops, newLayerStops);

        //Write back to original layer
        originLayer["paint"]["fill-color"]["stops"] = originLayerStops;

    }

    //Merge layers of type line
    if (originLayer["type"] == "line" && newLayer["paint"]["line-width"]) {
        originLayerStops = originLayer["paint"]["line-width"]["stops"];
        newLayerStops = newLayer["paint"]["line-width"]["stops"];

        originLayerStops = combineStops(originLayerStops, newLayerStops);

        //Write back to original layer
        originLayer["paint"]["line-width"]["stops"] = originLayerStops;

    }

    //Merge layers of type symbol
    if (originLayer["type"] == "symbol" && newLayer["paint"]["text-size"]) {
        originLayerStops = originLayer["paint"]["text-size"]["stops"];
        newLayerStops = newLayer["paint"]["text-size"]["stops"];

        originLayerStops = combineStops(originLayerStops, newLayerStops);

        //Write back to original layer
        originLayer["paint"]["text-size"]["stops"] = originLayerStops;
    }


    // console.log(
    //     "\nID " + originLayer["id"] +
    //     "\nOrigin minzoom " + originLayer["minzoom"] + ", New minzoom " + newLayer["minzoom"] +
    //     "\nOrigin maxzoom " + originLayer["maxzoom"] + ", New maxzoom " + newLayer["maxzoom"]);


    if (originLayer["minzoom"])
        if (!newLayer["minzoom"])
            delete originLayer["minzoom"];
        else
            originLayer["minzoom"] = _.min([originLayer["minzoom"], newLayer["minzoom"]]);

    if (originLayer["maxzoom"])
        if (!newLayer["maxzoom"])
            delete originLayer["maxzoom"];
        else
            originLayer["maxzoom"] = _.max([originLayer["maxzoom"], newLayer["maxzoom"]]);



}
/**
 * Combine stops for Layers with same ID
 * @param originLayerStops
 * @param newLayerStops
 */
function combineStops(originLayerStops, newLayerStops) {
    //Combine all the stops
    originLayerStops = _.union(originLayerStops, newLayerStops);
    //Sort them by key (zoomLevel)
    originLayerStops = _.sortBy(originLayerStops, function(element) { return element[1]; });
    originLayerStops = _.sortBy(originLayerStops, function(element) { return element[0]; });
    originLayerStops = clearUpStops(originLayerStops);

    return originLayerStops;
}
/**
 * Remove unnecessary stops: Duplicates and different values for same zoom level
 * @param originLayerStops
 */
function clearUpStops(originLayerStops) {
    var stopsToRemove = [];

    _.forEach(originLayerStops, function(stop, index){
        if (originLayerStops[index+1] &&
            stop[0] == originLayerStops[index+1][0])
            if (stop[1] <= originLayerStops[index+1][1])
                stopsToRemove.push(stop);
    });

    return _.difference(originLayerStops, stopsToRemove);
}