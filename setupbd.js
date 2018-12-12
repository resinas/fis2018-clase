var mongoose = require('mongoose');
var ApiKey = require('./apikeys');

mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    ApiKey.deleteMany({}, (err) => {
        var testUser = new ApiKey({user: "fis", password: "asdf"});
        testUser.save(function(err, user) {
            if(err) {
                console.log(err);
              } else {
                console.log('user: ' + user.user + ", "+ user.apikey + " saved.");
              }
        });        
    })
});
