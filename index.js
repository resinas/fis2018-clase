var express = require('express');
var bodyParser = require('body-parser');
var DataStore = require('nedb');
var cors = require('cors');
var path = require('path') 

const CONTACTS_APP_DIR = "/dist/contacts-app"; 
var port = 3000;
var BASE_URL = "/api/v1";
var filename = __dirname + "/contacts.json";

var contacts = [
    {"name": "juan", "phone": 5555}
];

var db = new DataStore({
    filename: filename,
    autoload: true
});

console.log("Starting API server...");

var app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, CONTACTS_APP_DIR))); 
app.get('/', function(req, res) { 
    res.sendFile(path.join(__dirname, CONTACTS_APP_DIR, '/index.html')); 
}); 


app.get(BASE_URL + "/contacts", (req, res) => {
    db.find({}, (err, contacts) => {
        if (err) {
            console.error("Error accessing database");
            res.sendStatus(500);
        } else {
            res.send(contacts.map((contact) => {
                delete contact._id;
                return contact;
            }));
        }
    });
});

app.post(BASE_URL + "/contacts", (req, res) => {
    var contact = req.body;
    db.insert(contact);
    res.sendStatus(201);
});


app.listen(port);

console.log("Server ready!");