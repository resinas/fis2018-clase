var server = require('./server');
var port = (process.env.PORT || 3000);

console.log("Starting API server...");

server.app.listen(port);

console.log("Server ready!");