const express = require('express');
const app = express();
const http = require('http');
const https = require('https');
const fs = require('fs');
const bodyParser = require('body-parser');

var userRoutes = require('./routes/users');
var architecturesRoutes = require('./routes/architectures');
var papersRoutes = require('./routes/papers');
var propertiesRoutes = require('./routes/properties');
var connectionsRoutes = require('./routes/connections');
var componentsRoutes = require('./routes/components');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "content-type, authorization");
    res.header("Access-Control-Allow-Credentials", true);

    if(req.method == "OPTIONS") {
        res.status(204).send()
    }
    else {
        next();
    }
});

app.use('/users', userRoutes);
app.use('/architectures', architecturesRoutes);
app.use('/papers', papersRoutes);
app.use('/properties', propertiesRoutes);
app.use('/connections', connectionsRoutes);
app.use('/components', componentsRoutes);

var httpServer = http.createServer(app);
console.log('HTTP serving on port 8080.');
httpServer.listen(8080);

try {
    var privateKey  = fs.readFileSync('certs/server.key', 'utf8');
    var certificate = fs.readFileSync('certs/server.crt', 'utf8');
    var credentials = {key: privateKey, cert: certificate};
    var httpsServer = https.createServer(credentials, app);
    console.log('HTTPS serving on port 8443.');
    httpsServer.listen(8443);
} catch (error) {
    console.log('Invalid certificates or certificates not found: the server will only serve in HTTP.');
    console.log(error);
}