module.exports = {
    type: type,
    source: source,
    scaleDenominatorToZoomLevel: scaleDenominatorToZoomLevel
}


/**
 * Get layer type by looking at the Symbolizer property
 * https://www.mapbox.com/mapbox-gl-style-spec/#layers
 * @param inputRule
 * @returns String type
 */
function type(inputRule) {
    // TODO Symbolizer can also be symbol, raster or background
    if (inputRule["PolygonSymbolizer"])
        return "fill";
    else if (inputRule["PolygonPatternSymbolizer"])
        return "fill";
    else if (inputRule["LineSymbolizer"])
        return "line";
    else if (inputRule["TextSymbolizer"])
        return "symbol";
    else if (inputRule["PointSymbolizer"])
        return "symbol";
    return null;
}

function source() {
    return "fastighetskartan";
}


/**
 * Converts the scale denominator into it's corresponding zoom level
 * See https://trac.openstreetmap.org/browser/subversion/applications/rendering/mapnik/zoom-to-scale.txt
 * @param inputDenominator
 * @returns zoomLevel
 */
function scaleDenominatorToZoomLevel(inputDenominator) {
    var scaleDenominators = [
        279541132.014, //1
        139770566.007, //2
        69885283.0036, //3
        34942641.5018, //4
        17471320.7509, //5
        8735660.37545, //6
        4367830.18772, //7
        2183915.09386, //8
        1091957.54693, //9
        545978.773466, //10
        272989.386733, //11
        136494.693366, //12
        68247.3466832, //13
        34123.6733416, //14
        17061.8366708, //15
        8530.9183354,  //16
        4265.4591677,  //17
        2132.72958385  //18
    ];
    // Zoom level is 18 if smaller than 2132.729...
    var zoomLevel = 18;

    scaleDenominators.forEach(function(denominator, index) {
        if (inputDenominator >= scaleDenominators[0])
            zoomLevel = 0;
        else if (inputDenominator > denominator &&
            inputDenominator <= scaleDenominators[index-1])
            //TODO make test for authencity
            zoomLevel = index + 1;

    });


    return zoomLevel;
}
