require("should");
var layout = require('../lib/layout.js');

var inputRule1 = {
    "MaxScaleDenominator": "5000",
    "Filter": "([DETALJTYP] = 'VATTRKT.S')",
    "TextSymbolizer": {
        "size": "12",
        "face-name": "GSDSymbolsFastighetskartan Regular",
        "fill": "#1da8fc",
        "allow-overlap": "true",
        "orientation": "[SRIKT]",
        "name": "''"
    }
};

var outputLayout1 = {
    "text-field": "{''}",
    "text-font": "GSDSymbolsFastighetskartan Regular",
    "text-allow-overlap": true
};

describe('Layout', function(){
    describe('Create a layout', function(){
        it('should return correct layout properties', function(){
            layout(inputRule1).should.have.property("text-field", "{''}");
            layout(inputRule1).should.have.property("text-font", "GSDSymbolsFastighetskartan Regular");
            layout(inputRule1).should.have.property("text-allow-overlap", true);
        })
    })
});