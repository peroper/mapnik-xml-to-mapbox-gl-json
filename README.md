# Mapnik XML to Mapbox GL JSON

Converts Mapnik XML styles into the [Mapbox GL JSON format](https://www.mapbox.com/mapbox-gl-style-spec/)

[![npm version](https://badge.fury.io/js/mapnik-xml-to-mapbox-gl-json.svg)](http://badge.fury.io/js/mapnik-xml-to-mapbox-gl-json)

## Installation
```
$ npm install -g mapnik-xml-to-mapbox-gl-json
```

Or download source and run

```
$ npm install
```

## Usage
mapnik-xml-to-mapbox-gl-json [settings file] [input XML file] [output JSON file]

```
$ ./bin/mapnik-xml-to-mapbox-gl-json bin/settings.json files/input.xml files/output.json
```

### Optional flags
**-v**  Validates generated JSON using [mapbox-gl-style-lint](https://github.com/mapbox/mapbox-gl-style-lint)

**-c**  Adds an 'paint.hide-*' class to all layers where the asterix is the layers 'source-layer'


## Conversion implementation
The converter does not support all Mapnik XML rules. Below are the rules that are converted to a corresponding Mapbox GL JSON style property:

 - Filter
 - MinScaleDenominator
 - MaxScaleDenominator
 - PolygonSymbolizer
 - LineSymbolizer
 - TextSymbolizer

Notice that all of the existing Mapnik XML parameters for these rules are not converted due to the lack of corresponding Mapbox GL JSON counterparts, or to the fact that they was not needed for our use case. Some parts are specific for our use case and needs modification to suit different Mapnik XMLs.