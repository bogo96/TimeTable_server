var express = require('express');
var app = express();

var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/test');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback(){
	console.log("mongo db connection OK.")
});

var Club = mongoose.Schema({
    
    club : Array
})

// var club = mongoose.model('club', Club);

var club = db.collection('club')

app.get('/getuserclub', (req,res) => {
    console.log('read all')

    club.find(function(error,data){
	if(error){
	    console.log(error);
	}else{
	    console.log(data);
	    res.json(data);
	}
    })
})



app.listen(5480, () =>{
    console.log('example app listening on port 5480');
});


