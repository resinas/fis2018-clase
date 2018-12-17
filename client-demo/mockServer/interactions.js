const ONE_CONTACT_BODY = [{ name: 'Foo', phone: 777 }]

module.exports = {
    getContactList: {
        state: 'it has one contact',
        uponReceiving: 'a request to retrieve contacts list',
        withRequest: {
            method: 'GET',
            path: '/api/v1/contacts'
        },
        willRespondWith: {
            status: 200,
            body: ONE_CONTACT_BODY
        }
    }
}