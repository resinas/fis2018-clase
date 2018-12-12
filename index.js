var server = require('./server');
var mongoose = require('mongoose');
var ApiKey = require('./apikeys');
var port = (process.env.PORT || 3000);

console.log("Starting API server...");
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    server.app.listen(port);
    console.log("Server ready!");

    if (ApiKey.find((err, apikeys) => {
        if (apikeys.length == 0) {
            var testUser = new ApiKey({user: "fis", password: "asdf"});
            testUser.save(function(err, user) {
                if(err) {
                    console.log(err);
                  } else {
                    console.log('user: ' + user.user + ", "+ user.apikey + " saved.");
                  }
            });        
        }    
    }));
});

