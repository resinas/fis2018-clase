var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var contactsResource = require('./contactsResource.js');

var port = (process.env.PORT || 16778);
var baseAPI = "/api/v1";

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get(baseAPI + "/contacts", (req, response) => {
    console.log("GET /contacts"); 

    contactsResource.getAllContacts()
        .then((body) => {
            response.send(body);
        }).catch((error) => {
            console.log('error:'+error);
            response.sendStatus(500);
        });

});

app.listen(port, () => {
    console.log("Server up and running!!");
});