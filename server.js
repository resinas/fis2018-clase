var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');
var Contact = require('./contacts');
var ApiKey = require('./apikeys');

var passport = require('passport');
var LocalAPIKey = require('passport-localapikey-update').Strategy;

const CONTACTS_APP_DIR = "/dist/contacts-app"; 
var BASE_API_PATH = "/api/v1";



passport.use(new LocalAPIKey(
    (apikey, done) => {
        ApiKey.findOne({apikey: apikey}, (err, user) => {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Unknown apikey ' +apikey });
            } else {
                console.log("Logged as: " + user.user);
                return done(null, user);
            }
        });
    }
));

var app = express();
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(cors());

app.use(express.static(path.join(__dirname, CONTACTS_APP_DIR))); 
app.get('/', function(req, res) { 
    res.sendFile(path.join(__dirname, CONTACTS_APP_DIR, '/index.html')); 
}); 


app.get(BASE_API_PATH + "/contacts", 
        (req, res) => {
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
        }
);


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
    Contact.deleteMany({}, (err) => {
        if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
        }
    });    
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

    Contact.find({"name": name},(err,contacts)=>{
        if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
        }else{
            if (contacts.length == 0) {
                res.sendStatus(404);
            } else {
                res.send(contacts[0].cleanup());
                if(contacts.length>1) {
                    console.warn("Incosistent DB: duplicated name");
                }
            } 
        }
    });
});


app.delete(BASE_API_PATH + "/contacts/:name", (req, res) => {
    // Delete a single contact
    var name = req.params.name;
    console.log(Date()+" - DELETE /contacts/"+name);

    Contact.deleteMany({"name": name},(err, removeResult)=>{
        if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
        }else{
            if(removeResult.n>1){
                console.warn("Incosistent DB: duplicated name");
            }else if(removeResult.n == 0) {
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

    Contact.replaceOne({"name": name},
                updatedContact,
                (err,updateResult)=>{
        if(err){
            console.error("Error accesing DB");
            res.sendStatus(500);
        }else{
            if(updateResult.n>1){
                console.warn("Incosistent DB: duplicated name");
            }else if(updateResult.n == 0) {
                res.sendStatus(404);
            } else {
                res.sendStatus(200);
            }
        }
    });
});

module.exports.app = app;
