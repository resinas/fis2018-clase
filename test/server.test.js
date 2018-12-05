var server = require('../server');
var chai = require('chai');
var chaiHttp = require('chai-http');
var sinon = require('sinon');
var Contact = require('../contacts');
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
        var contact = new Contact({"name": "pepe", "phone": 6666});
        var contactMock = sinon.mock(contact);
        contactMock.expects('cleanup').returns({"name": "pepe", "phone": 6666});

        var ContactStub = sinon.stub(Contact, 'find');
        ContactStub.yields(null, [contact]);

        it('should return all contacts', (done) => {
            chai.request(server.app)
                .get('/api/v1/contacts')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.have.lengthOf(1);
                    contactMock.verify();
                    done();
                });  
        });
    });

    describe('POST /contacts', () => {
        it('should create a new contact', (done) => {
            var contact = {"name": "jaime", "phone":1111};
            var dbMock = sinon.mock(Contact);
            dbMock.expects('create').withArgs(contact).yields(null);
    
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

    describe('POST /contacts', () => {
        it('should return 500 if fails', (done) => {
            var contact = {"name": "jaime", "phone":1111};
            var dbMock = sinon.mock(Contact);
            dbMock.expects('create').withArgs(contact).yields(true);
    
            chai.request(server.app)
                .post('/api/v1/contacts')
                .send(contact)
                .end((err, res) => {
                    expect(res).to.have.status(500);
                    dbMock.verify();
                    done();
                });  

        });
    });    

});