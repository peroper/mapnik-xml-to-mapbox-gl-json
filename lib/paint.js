var helper = require('./helper.js');

module.exports = paint;

function paint(inputRule) {
    var paint = {};
    if (helper.type(inputRule) == "fill")
        paint = paintFill(inputRule);
    else if (helper.type(inputRule) == "line")
        paint = paintLine(inputRule);
    else if (helper.type(inputRule) == "symbol")
        paint = paintSymbol(inputRule);

    return paint;
}

function paintFill(inputRule) {
    
    if (inputRule["PolygonSymbolizer"])
        return paintFillPolygon(inputRule);

    if (inputRule["PolygonPatternSymbolizer"])
        return paintFillImage(inputRule["PolygonPatternSymbolizer"]["file"]);    

}

function paintFillPolygon(inputRule) {
    // Default grey according to Mapnik XML reference
    var fill = "#e3e3e3";
    if (inputRule["PolygonSymbolizer"]["fill"])
        fill = inputRule["PolygonSymbolizer"]["fill"];

    var stops = [];

    if (inputRule["MaxScaleDenominator"])
        stops.push([helper.scaleDenominatorToZoomLevel(parseInt(inputRule["MaxScaleDenominator"])), fill]);

    if (inputRule["MinScaleDenominator"])
        stops.push([helper.scaleDenominatorToZoomLevel(parseInt(inputRule["MinScaleDenominator"])), fill]);

    return {
        "fill-color": {
            "stops": stops
        }
    };
}

function paintFillImage(inputImage) {
    var paint = {};
    // Split on "." and keep first index in order to remove .png, .jpeg etc..
    var fillImage = inputImage.split(".")[0];
    paint["fill-image"] = fillImage;

    return paint;
}

function paintLine(inputRule) {
    var paint = {};

    var inputLine = inputRule["LineSymbolizer"];
    if (inputLine["stroke"])
        paint["line-color"] = inputLine["stroke"];


    if (inputLine["stroke-opacity"])
        paint["line-opacity"] = parseFloat(inputLine["stroke-opacity"]);

    // line-width stops
    var lineWidth;
    if (inputLine["stroke-width"]) {
        lineWidth = parseFloat(inputLine["stroke-width"]);

        stops = [];

        if (inputRule["MaxScaleDenominator"])
            stops.push([helper.scaleDenominatorToZoomLevel(parseInt(inputRule["MaxScaleDenominator"])), lineWidth]);

        if (inputRule["MinScaleDenominator"])
            stops.push([helper.scaleDenominatorToZoomLevel(parseInt(inputRule["MinScaleDenominator"])), lineWidth]);


        if (stops.length > 0) {
            paint["line-width"] = {
                "stops": stops
            };
        }
        else
            paint["line-width"] = lineWidth;
    }

    if (inputLine["stroke-dasharray"]) {
        paint["line-dasharray"] = paintLineDashArray(inputLine["stroke-dasharray"], lineWidth);
    }

    /*
    if (inputLine["stroke"]) {
        var lineStroke = paintLineDashArray(inputLine["stroke"]);

        stops = []
        if (inputRule["MaxScaleDenominator"])
            stops.push([helper.scaleDenominatorToZoomLevel(parseInt(inputRule["MaxScaleDenominator"])), lineStroke]);

        if (inputRule["MinScaleDenominator"])
            stops.push([helper.scaleDenominatorToZoomLevel(parseInt(inputRule["MinScaleDenominator"])), lineStroke]);

        paint["line-color"] = {
            "stops": stops
        };
    }*/



    return paint;
}

function paintLineDashArray(inputDashArray, lineWidth) {
    var temp = inputDashArray.split(',');
    var lineDashArray = [];

    for(var i = 0; i < temp.length; i++)
        lineDashArray[i] = lineWidth ? parseFloat(temp[i]) / lineWidth : parseFloat(temp[i]);

    return lineDashArray;
}

function paintSymbol(inputRule) {

    // TODO Make two separate functions for TextSymbolizer and PointSymbolizer
    if (inputRule["TextSymbolizer"])
        return paintTextSymbol(inputRule);

    // if (inputRule["PointSymbolizer"])
    //     return paintPointSymbol(inputRule["PointSymbolizer"]["file"]);


}

function paintTextSymbol(inputRule) {

    var paint = {};

    var inputSymbol = inputRule["TextSymbolizer"];

    if(inputSymbol["size"])
        paint["text-size"] = inputSymbol["size"];
    if(inputSymbol["fill"])
        paint["text-color"] = inputSymbol["fill"];

    if(inputSymbol["size"]) {
        var textSize = parseFloat(inputSymbol["size"]);

        var stops = [];

        if (inputRule["MaxScaleDenominator"])
            stops.push([helper.scaleDenominatorToZoomLevel(parseInt(inputRule["MaxScaleDenominator"])), textSize]);

        if (inputRule["MinScaleDenominator"])
            stops.push([helper.scaleDenominatorToZoomLevel(parseInt(inputRule["MinScaleDenominator"])), textSize]);

        //Same text size for all zoom levels
        if (!parseInt(inputRule["MinScaleDenominator"]) && !parseInt(inputRule["MaxScaleDenominator"]))
            paint["text-size"] = parseFloat(inputSymbol["size"]);
        else
            paint["text-size"] = {
                "stops": stops
            }
    }
    return paint;
}
