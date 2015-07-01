var fs = require('fs'),
    _ = require('underscore'),
    argv = require('optimist').argv,
    preprocess = require('./lib/preprocess.js'),
    postprocess = require('./lib/postprocess.js'),
    layers = require('./lib/layers.js'),
    filter = require('./lib/filter.js'),
    hide = require('./lib/additions/hide.js');


module.exports = generateJSON;

function generateJSON(inputXML, settings, callback) {

    preprocess(inputXML);

    var outputJSON = settings;
    outputJSON["layers"] = layers(inputXML, settings);

    postprocess(outputJSON);


    if (argv.c)
        _.each(outputJSON["layers"], function(layer, index, layerList) {
            layerList[index] = hide(layer);
        });


    return callback(null, outputJSON);
}


