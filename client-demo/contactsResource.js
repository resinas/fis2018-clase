var urljoin = require('url-join');
var request = require('request-promise-native').defaults({json: true});
var contactsServer = (process.env.CONTACTS_URL || 'http://localhost:3000/api/v1');
var contactsKey = 'aaae1676-0b9a-4b65-bf41-975929bf93c5';

function contactsResource(url) {
    return urljoin(contactsServer, url, '?apikey='+contactsKey);
}

function getAllContacts() {
    var url = contactsResource("/contacts");
    console.log(url);
    return request.get(url);
}

module.exports = {
    getAllContacts
}