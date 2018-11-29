var server = require('../server');
var chai = require('chai');
var chaiHttp = require('chai-http');
var sinon = require('sinon');
var expect = chai.expect;

chai.use(chaiHttp);

describe('Contacts API', () => {
    it('hola mundo de prueba', (done) => {
        var x = 3;
        var y = 5;

        var resultado = x + y;

        expect(resultado).to.equal(8);
        done();
    });

    before((done) => {
        var contacts = [
            {"name": "juan", "phone": 5555},
            {"name": "pepe", "phone": 6666}
        ];

        var dbFindStub = sinon.stub(server.db, 'find');
        dbFindStub.yields(null, contacts);

        done();
    });

    describe('GET /', () => {
        it('should return HTML', (done) => {
            chai.request(server.app)
                .get('/')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.html;
                    done();
                });        
        });
    });

    describe('GET /contacts', () => {
        it('should return all contacts', (done) => {
            chai.request(server.app)
                .get('/api/v1/contacts')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(2);
                    done();
                });  
        });
    });

    describe('POST /contacts', () => {
        it('should create a new contact', (done) => {
            var contact = {"name": "jaime", "phone":1111};
            var dbMock = sinon.mock(server.db);
            dbMock.expects('insert').withArgs(contact);
    
            chai.request(server.app)
                .post('/api/v1/contacts')
                .send(contact)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    dbMock.verify();
                    done();
                });  

        });
    });
});