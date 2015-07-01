var _ = require('underscore'),
    filter = require('./filter.js');

module.exports = preprocess;

function preprocess(inputXML) {

    // Merges the Style into their corresponding Layer
    inputXML["Layer"].forEach(function(layer, index, layers) {
        // Get all styles from "Style" array if the current "StyleName" matches
        
        // Skip layers without styles
        if (!layer["StyleName"] || layer["StyleName"] === '')
            return ;

        if (!_.isArray(layers[index].styles))
            layers[index].styles = [];

        if (_.isArray(layer["StyleName"]))
            layer["StyleName"].forEach(function(styleName) {
                layers[index].styles.push(_.find(inputXML["Style"], function(style) {
                    return style["name"] == styleName;
                }));
            });
        else
            layers[index].styles.push(_.find(inputXML["Style"], function(style) {
                return style["name"] == layer["StyleName"];
            }));

        delete layers[index]["StyleName"];

    });

    // Parse all filters using filter.js
    inputXML["Layer"].forEach(function(layer, index, layers) {
        // Skip layers without styles
        if (!layer["styles"]) {
            return ;
        }
        
        // Loop all styles previously added to "Layer"
        layer["styles"].forEach(function(style, index, styles) {
            // Are there more than one rule?
            if (_.isArray(style["Rule"]))
                _.each(style["Rule"], function(rule, index, rules) {
                    // For each rule, parse its filter.. if exists
                    if (rule.hasOwnProperty("Filter"))
                        rules[index]["Filter"] = filter(rule["Filter"]);
                });
            // Only one rule, parse its filter if it exists
            else if (style["Rule"] && style["Rule"].hasOwnProperty("Filter"))
                style["Rule"]["Filter"] = filter(style["Rule"]["Filter"]);


        });
    });

    delete inputXML["Style"];

}


