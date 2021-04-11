const express = require('express');
// set up plain http server
var http = express();

// set up a route to redirect http to https
http.get('*', function(req, res) {  
	res.redirect('https://' + req.headers.host + req.url);
})

http.listen(80);
