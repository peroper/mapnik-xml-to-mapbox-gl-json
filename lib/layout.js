module.exports = layout;

// Very hard coded to suit the specific input XML. Needs to be redone to suit texts in other styles

function layout(inputRule) {
    var layout = {};


    var inputSymbol = inputRule["TextSymbolizer"];

    /*
    if(inputSymbol["allow-overlap"]) {
        if (inputSymbol["allow-overlap"] === "true")
            layout["text-allow-overlap"] = true;
        else if (inputSymbol["allow-overlap"] === "false")
            layout["text-allow-overlap"] = false;
    }*/
    if (inputRule["TextSymbolizer"]) {
        //console.log(inputRule["TextSymbolizer"]["_"]);
        var inputTextSymbol = inputRule["TextSymbolizer"];

        // {stedsnavn} för norge. {TEXT} för fastighetskartan.
        var textField = "{TEXT}";
        //layout["text-field"] = "{stedsnavn}";
        /*layout["text-max-size"] = 22;
        layout["text-max-width"] = 10;
        layout["text-font"] = "Arial Regular";*/

        var emptyStringPattern = /\'\'/;
        var textFieldValue;
        var overlap;

        //Replace "{''}" with "{TEXT}"
        if(emptyStringPattern.exec(inputTextSymbol["name"]))
            textFieldValue = textField;
            //name is deprecated since Mapnik 2.0
        else if(inputTextSymbol["name"])
            textField = "{" + inputTextSymbol["name"].replace(/(\[|\])/g, '') + "}";
        
        //Value of TextSymbolizer
        else if(inputTextSymbol["_"])
            textField = "{" + inputTextSymbol["_"].replace(/(\[|\])/g, '') + "}";

        layout["text-field"] = textField;
        
        if(inputTextSymbol["face-name"])
            layout["text-font"] = inputTextSymbol["face-name"];
        // if(inputTextSymbol["allow-overlap"]) {
        //     if (inputTextSymbol["allow-overlap"] === "true")
        //         layout["text-allow-overlap"] = true;
        //     else if (inputTextSymbol["allow-overlap"] === "false")
                layout["text-allow-overlap"] = false;
        // }
    }


    // TODO PointSymbolizers
    /*if (inputRule["PointSymbolizer"]) {
        var inputPointSymbol = inputRule["PointSymbolizer"];
        var path = "";
        var iconImage = inputPointSymbol["file"].split(".")[0];
        layout["icon-image"] = "Textures/enkeltminner_punkt_ark";
    }*/



    return layout;
}