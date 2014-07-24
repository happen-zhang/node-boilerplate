
describe('test', function() {
    var myarr = [1, 2, 3, 4];

    it('array length should be 4', function() {
        myarr.length.should.equal(4);

        myarr[1].should.equal(3);
    });
});
