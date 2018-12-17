const chai = require('chai')
chai.use(require('chai-things'));
const provider = require('./mockServer/provider')
const contactsResource = require('./contactsResource')
const interactions = require('./mockServer/interactions');

const expect = chai.expect

describe('contacts api', () => {
    before(() => provider.setup());

    after(() => provider.finalize());
    
    afterEach(() => provider.verify());

    describe('#getAllContacts', () => {
        before(done => {
            provider.addInteraction(interactions.getContactList)
                .then(() => {
                    done();
                })
        });

        it('should get contact list from server', (done) => {
            contactsResource.getAllContacts()
              .then((contacts) => {
                expect(contacts).to.have.lengthOf(1);
                expect(contacts).to.contain.an.item.with.property('name', 'Foo');
                expect(contacts).to.contain.an.item.with.property('phone', 777);
                done();
              }, done);
        }) 
    })
})