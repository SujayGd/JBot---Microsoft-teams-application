var http = require('http');

var express = require('express');
var app = express();
const request = require('request');
 
var PORT = process.env.PORT || 8089;
 
app.listen(PORT, function () {
console.log('Server running, Express is listening...');
});
 
app.get('/', function (req, res) {
res.writeHead(200, {'Content-Type': 'text/html'});
res.write("No Data Requested, so none is returned");
res.end();
});

app.get('/data', function(req,res){ 
request({'url':'<your company API url for jobs>',
 json: true },

 (err,out, body) => {
  if (err) { return console.log(err); }
  console.log(out.body.Data[0]);
  console.log(out);
    var json = JSON.stringify(out.body.Data);
    res.write(json);
    res.end();
}); 
res.writeHead(200, {'Content-Type': 'application/json'});
 } );