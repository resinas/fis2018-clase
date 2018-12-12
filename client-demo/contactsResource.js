var urljoin = require('url-join');
var request = require('request-promise-native').defaults({json: true});
var CommandFactory = require('hystrixjs').commandFactory;
var contactsServer = (process.env.CONTACTS_URL || 'http://localhost:3000/api/v1');
var contactsKey = (process.env.CONTACTS_APIKEY || 'aaf88607d0-52ad-41ae-887c-34c029d48242');

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