module.exports = filter;

var debug = false;

/**
 * Create an array for Mapbox GL JS filters: ["operator", key, value]
 * From incoming filter String: ([KEY] = 'VALUE')
 * filter String can be combined with and, or, not
 *
 * @param {String} filterString
 * @returns {Array} filtersArr
 */
function filter(filterString) {

    /*
    Filters can be combined with the following operators:
        A and B
        A or B
        not A
    */
    //TODO: add split for 'or' and 'not' if necessary.
    //TODO: Check nested () in filterString.

    //Is this good enough?
    //Split all filters into an array with one filter per position.
    var separators = [' and ', ' or ', ' not '];
    var filters = filterString.split(new RegExp(separators.join('|'), 'g'));

    //Regexp patterns for keys, values and operators in a filter
    //var keyPattern =    /\[([^\]]+)]/;
    //var valuePattern =  /'([^']+)'/;
    var operatorPattern = /(<=|<|>=|>|!=|=)/;
    var emptyStringPattern = /\'\'/;

    //Array containing all filters
    var filterArr = [];

    //If there are multiple filters, first index = "all"
    filterArr[0] = "all";

    for(var i = 0; i< filters.length; i++) {
        if(debug)
            console.log("Incoming filter: " + filters[i]);

        //A single filter
        var filter = [];

        var currentFilter = filters[i].replace(/(\(|\))/g, ''); //Remove parentheses
        var filterParts = currentFilter.split(' ');

        var key = filterParts[0].replace(/(\[|\])/g, '');

        var value = "";

        if(filterParts.length == 3){
            if(!emptyStringPattern.exec(filterParts[2]))
                value = filterParts[2].replace(/'/g, '');
            else
                value = filterParts[2];
        }

        else {
            for(var j = 2; j < filterParts.length; j++)
                value +=  filterParts[j].replace(/'/g, '') + " ";
        }

        value = value.trim();
        var operator = operatorPattern.exec(filters[i]);

        switch(operator[1]) {

            case "<":
                filter[0] = "<";
                break;

            case "<=":
                filter[0] = "<=";
                break;

            case ">":
                filter[0] = ">";
                break;

            case ">=":
                filter[0] = ">=";
                break;

            case "!=":
                filter[0] = "!=";
                break;

            default:  // =
                filter[0] = "==";
                break;

        }

        if (key)
            filter[1] = key;
        if (value)
            filter[2] = !isNaN(value) ? parseInt(value) : value;

        if(debug) {
            console.log("Current filter: " + currentFilter);
            console.log("Filterparts: " + filterParts.length);
            console.log("Key: " + key);
            console.log("Operator: " + operator[1]);
            console.log("Value: " + value);
            console.log("Filter: " + filter);
            console.log("\n");
        }

        filterArr[i+1] = filter;
    }

    if(debug) {

        if(filterArr.length == 2) {
            console.log("Only one filter: ")
            console.log(filter);
        }
        else {
            console.log("Filter Array: ")
            console.log(filterArr);
            console.log("Filter array length: " + filterArr.length);
        }

    }


    if(filterArr.length == 2)   //There is only one filter, since filterArr[0] = "all"
        return filter;
    else
        return filterArr;       //Return array ["all", [], [] ]
}