
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
global.q = require("q");

app.use(bodyParser.json());
app.use(express.static(__dirname));


app.set('port', process.env.PORT || 1447);
var server = app.listen(app.get('port'), function() {
	console.log("Tests App runing on PORT:"+app.get('port'));	
});
