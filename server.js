var express = require('express');
var bodyParser = require('body-parser');
var DataStore = require('nedb');
var cors = require('cors');
var path = require('path');
var Contact = require('./contacts');

const CONTACTS_APP_DIR = "/dist/contacts-app"; 
var BASE_API_PATH = "/api/v1";
var filename = __dirname + "/contacts.json";

var contacts = [
    {"name": "juan", "phone": 5555}
];

var db = new DataStore({
    filename: filename,
    autoload: true
});

var app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, CONTACTS_APP_DIR))); 
app.get('/', function(req, res) { 
    res.sendFile(path.join(__dirname, CONTACTS_APP_DIR, '/index.html')); 
}); 


app.get(BASE_API_PATH + "/contacts", (req, res) => {
    Contact.find((err, contacts) => {
        if (err) {
            console.error("Error accessing database");
            res.sendStatus(500);
        } else {
            res.send(contacts.map((contact) => {
                return contact.cleanup();
            }));
        }
    });
});


app.post(BASE_API_PATH + "/contacts", (req, res) => {
    // Create a new contact
    console.log(Date()+" - POST /contacts");
    var contact = req.body;
    Contact.create(contact, (err) => {
        if (err) {
            console.error(err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});

app.put(BASE_API_PATH + "/contacts", (req, res) => {
    // Forbidden
    console.log(Date()+" - PUT /contacts");
    res.sendStatus(405);
});

app.delete(BASE_API_PATH + "/contacts", (req, res) => {
    // Remove all contacts
    console.log(Date()+" - DELETE /contacts");
    db.remove({});    
    res.sendStatus(200);
});


app.post(BASE_API_PATH + "/contacts/:name", (req, res) => {
    // Forbidden
    console.log(Date()+" - POST /contacts");
    res.sendStatus(405);
});



app.get(BASE_API_PATH + "/contacts/:name", (req, res) => {
    // Get a single contact
    var name = req.params.name;
    console.log(Date()+" - GET /contacts/"+name);

    db.find({"name": name},(err,contacts)=>{
        if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
        }else{
            if(contacts.length>1){
                console.warn("Incosistent DB: duplicated name");
            }
            res.send(contacts.map((contact)=>{
                delete contact._id;
                return contact;
            })[0]);
        }
    });
});


app.delete(BASE_API_PATH + "/contacts/:name", (req, res) => {
    // Delete a single contact
    var name = req.params.name;
    console.log(Date()+" - DELETE /contacts/"+name);

    db.remove({"name": name},{},(err,numRemoved)=>{
        if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
        }else{
            if(numRemoved>1){
                console.warn("Incosistent DB: duplicated name");
            }else if(numRemoved == 0) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        }
    });
});
app.delete(BASE_API_PATH + "/contacts/:name", (req, res) => {
    // Delete a single contact
    var name = req.params.name;
    console.log(Date()+" - DELETE /contacts/"+name);

    db.remove({"name": name},{},(err,numRemoved)=>{
        if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
        }else{
            if(numRemoved>1){
                console.warn("Incosistent DB: duplicated name");
            }else if(numRemoved == 0) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        }
    });
});

app.put(BASE_API_PATH + "/contacts/:name", (req, res) => {
    // Update contact
    var name = req.params.name;
    var updatedContact = req.body;
    console.log(Date()+" - PUT /contacts/"+name);

    if(name != updatedContact.name){
        res.sendStatus(409);
        return;
    }

    db.update({"name": name},updatedContact,(err,numUpdated)=>{
        if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
        }else{
            if(numUpdated>1){
                console.warn("Incosistent DB: duplicated name");
            }else if(numUpdated == 0) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        }
    });
});

module.exports.app = app;
module.exports.db = db;