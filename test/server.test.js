
var chai = require('chai');
var expect = chai.expect;


describe('Contacts API', () => {
    it('hola mundo de prueba', (done) => {
        var x = 3;
        var y = 5;

        var resultado = x + y;

        expect(resultado).to.equal(8);
        done();
    });
});