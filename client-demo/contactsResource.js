var urljoin = require('url-join');
var request = require('request-promise-native').defaults({json: true});
var CommandFactory = require('hystrixjs').commandFactory;
var contactsServer = (process.env.CONTACTS_URL || 'http://localhost:3000/api/v1');
var contactsKey = 'aae1676-0b9a-4b65-bf41-975929bf93c5';

function contactsResource(url) {
    return urljoin(contactsServer, url, '?apikey='+contactsKey);
}

function getAllContactsBase() {
    var url = contactsResource("/contacts");
    console.log(url);
    return request.get(url);
}


var getAllContactsCommand = CommandFactory.getOrCreate("Get Contacts")
    .run(getAllContactsBase)
    .timeout(100)
    .build()

function getAllContacts() {
    return getAllContactsCommand.execute();
}

module.exports = {
    getAllContacts
}