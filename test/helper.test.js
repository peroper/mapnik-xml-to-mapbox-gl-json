require("should");
var helper = require('../lib/helper.js');

describe('Helper', function(){
    describe('Scaledenominator to Zoomlevel', function(){
        it('should return 18 if less than 2132.729...', function(){
            helper.scaleDenominatorToZoomLevel(2132.71).should.be.exactly(18).and.be.a.Number;
        })
        it('should return 0 if greater than 279541132.014...', function(){
            helper.scaleDenominatorToZoomLevel(279541132.1).should.be.exactly(0).and.be.a.Number;
        })
        it('should be between 1 and 2 if between 279541132 and 139770566', function(){
            helper.scaleDenominatorToZoomLevel(200770566).should.be.within(1,2);
        })
        it('should be between 17 and 18 if between 4265 and 2132', function(){
            helper.scaleDenominatorToZoomLevel(3000).should.be.within(17,18);
        })
        it('should be around 9.5 if 545978.773466 * 1.5', function(){
            helper.scaleDenominatorToZoomLevel(545978.773466 * 1.5).should.be.within(9.4, 9.6);
        })
        it('should be around 17.1 if 4000', function(){
            helper.scaleDenominatorToZoomLevel(4000).should.be.within(17.1, 17.2);
        })
        it('should be around 17.9 if 2200', function(){
            helper.scaleDenominatorToZoomLevel(2200).should.be.within(17.85, 17.99);
        })
        it('should be around 13 if 100000', function(){
            helper.scaleDenominatorToZoomLevel(100000).should.be.within(12.5, 13.5);
        })
        it('should be around 9 if 1500000', function(){
            helper.scaleDenominatorToZoomLevel(1500000).should.be.within(8.5, 9.5);
        })
    })
});  