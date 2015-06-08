module.exports = addHideClass;


/**
 * This function will add a 'paint.hide-*' property to the inputLayer that has
 * an opacity: 0; setting. (* is the 'source-layer' of current layer)
 * All the layers with the same 'source-layer' will have the same 'paint.hide-*'-class.
 * If not already exists, it will also add an opacity: 1, to the existing paint.
 *
 * This makes it possible to use Mapbox' map.removeClass() and map.addClass() to hide
 * and show individual 'source-layer's
 * @param layer
 */
function addHideClass(layer) {


    var propertyName = "";
    if (layer["type"] == "line")
        propertyName = "line";
    else if (layer["type"] == "fill")
        propertyName = "fill";
    else if (layer["type"] == "symbol")
        propertyName = "text";



    layer["paint.hide-" + layer["source-layer"]] = {};
    layer["paint.hide-" + layer["source-layer"]][propertyName + "-opacity"] = 0;

    if (!layer["paint"]) {
        layer["paint"] = {};
        layer["paint"][propertyName + "-opacity"] = 1;
    }


    else if (!layer["paint"].hasOwnProperty(propertyName + "-opacity"))
        layer["paint"][propertyName + "-opacity"] = 1;



    return layer;


}
