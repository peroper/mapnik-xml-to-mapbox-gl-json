require("should");
var postprocess = require('../lib/postprocess.js');

var orderedStopsDuplicates1_input = [
    [1, 3],
    [1, 3],
    [2, 5],
    [2, 6],
    [2, 7],
    [4, 8]
];

var orderedStopsDuplicates1_output = [
    [1, 3],
    [2, 5],
    [4, 8]
];

// TODO: can't test private functions, what to do?
/*
describe('Postprocess', function(){
    describe('ClearUp', function(){
        it('should remove key/value AND key duplicates', function(){
            postprocess.clearUp(orderedStopsDuplicates1_input).should.be.exactly(orderedStopsDuplicates1_output);
        });
    })
});
    */