var express = require('express');
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/timetable');
//dd
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback () {
        console.log("mongo db connection OK.");
});


var UserInformation = mongoose.Schema({
	studentid : String,
	password : String,
	school : String,
	name : String,
	club : Array,
//	club : [{name : String ,}],
//	subject : []
	subject : [{semester : String, code : String, grade : String}],
	major : String
});

var userinformation = mongoose.model('tests',UserInformation);
var col = db.collection('tests');
var clubdb = db.collection('club');
// register login data

app.post('/post',(req,res)=>{
	console.log('who get in here post/users');
	var inputData;

	req.on('data', (data)=>{
		
		inputData = JSON.parse(data);
		
		var user = new userinformation({studentid : inputData.studentid, password : inputData.password, school : inputData.school, name : inputData.name });
		
		col.findOne({ studentid : inputData.studentid}, function(error,data){
		    if(error){
			console.log(error);
		    }else if(!data){
			user.save(function(err,user){
			    if(error){
				console.log(err);
			    }else{
				res.write("save");
				res.end();
			    }
			});
		    }else{
			res.write("already")
			res.end();
		    }
		});
		    		
	});

	req.on('end', () => {
		console.log('saved!');
	});
});

// major
app.post('/majorInfo', (req,res)=>{

    console.log('who get his/her majorInfo')
    var inputData
    req.on('data',(data)=>{
	inputData = JSON.parse(data);
	userinformation.findOne({ studentid : inputData.studentid}, function(error,data){
	    if(error){
		console.log(error);
	    }else{
		console.log(data);
		res.json(data);
		res.end;
	    }
	});
    });
})


// register subject data

app.post('/subject',(req,res)=>{
    console.log('one user post subject');
    var inputData;
    
    req.on('data', (data)=>{
	console.log(data.studentid)
		
	inputData = JSON.parse(data);
	console.log(inputData)
	sub = inputData.subject
	console.log(sub)
	col.update( { studentid : inputData.studentid }, { $push: { subject : {semester : sub.semester, code : sub.code  }}}, function(error,data){
	    if(error){
		console.log(error);
	    }
	})
    
    });
    req.on('end', ()=> {
	console.log('modified!')
    })
})

app.post('/grade',(req,res)=>{
    console.log("IN grade");
    var inputData;
    req.on('data', (data)=>{
	console.log(data.studentid);
  
	inputData = JSON.parse(data);
	console.log(inputData);
	col.update( {studentid : inputData.studentid}, { $set: { subject : inputData.subject }}, function(error, user){
	    if(error){
		console.log(error)
	    }
	    console.log(user)
	});

    })
    
    req.on('end', () => {
	console.log("OUT grade")
    });
})

// get clubmate

app.get('/getUser', (req,res) => {
    console.log("IN getUser")
    userinformation.find(function(error, data){
    if(error){
	console.log(error)
    }else{
	res.json(data);
	res.end;
    }
    })
})

/*
app.get('/getUser',(req,res)=>{
    console.log('who find club mate')
    
    userinformation.find(function(error,data){
	if(error){
	    console.log(error);
	}else{
	    console.log(data);
	    res.json(data);
	    res.end;
	}
    });
});
*/




// get club data

var Club = mongoose.Schema({

    club : Array,

})

// var club = mongoose.model('club', Club);
var club = db.collection('club');

app.get('/club', (req,res)=>{
    console.log('who get club data')
    
    club.find({ temp : "1" }).toArray (function(error,data){
	if(error){
	    console.log(error)
	} else{
	    console.log(data);
	    res.json(data);
	    res.end;
	}
    });
})

// load user data





app.post('/getuserclub', (req,res)=>{

    console.log('who get his/her club')
    var inputData
    req.on('data',(data)=>{
	inputData = JSON.parse(data);
	userinformation.findOne({ studentid : inputData.studentid}, function(error,data){
	    if(error){
		console.log(error);
	    }else{
		console.log(data);
		res.json(data);
		res.end;
	    }
	});
    });
})

// add club data

app.post('/addclublist', (req,res)=>{
    console.log('who insert club list')
    var inputData
    req.on('data', (data)=>{
	inputData = JSON.parse(data);
	clubdb.update({ temp : "1"}, { $push : { club : inputData.club } },function(error,data){
	    if(error){
		console.log(error)
	    }
	})
    });
    req.on('end',()=>{
	console.log('club list modified')
    })
})



// insert club data

app.post('/insertclub', (req,res)=>{
    console.log('who insert club')
    var inputData
    req.on('data', (data)=>{
	inputData = JSON.parse(data);
	col.update({ studentid : inputData.studentid}, { $push : { club : inputData.club } },function(error,data){
	    if(error){
		console.log(error);
		}
		console.log(inputData.club)
	})
    });
    req.on('end', ()=>{
	console.log('club modified')
    })
})

// delete club data

app.post('/deleteclub',(req,res)=>{
    console.log('who delete club')
    var inputData
    req.on('data', (data)=>{
	inputData = JSON.parse(data);
	col.update({ studentid : inputData.studentid}, { $pull : { club : inputData.club }}, function(error,data){
	    if(error){
		console.log(error);
	    }
	})
    });
    req.on('end', () => {
	console.log('club modified')
    })
})




// give KAIST subject data

var subject = mongoose.Schema({
    Department : 'string',
    CourseType : 'string',
    CourseNum : 'string',
    Section : 'string',
    CourseTitle : 'string',
    AU : 'string',
    Credit : 'string',
    Instructor : 'string',
    ClassTime : 'string',
    classroom : 'string',
});

var KAISTsubject = mongoose.model('kaist2000', subject);

app.get('/KAIST',(req,res)=>{
    console.log('who get in here/users');
    
    KAISTsubject.find(function(error, data){
        console.log('--- read all ---')
        if(error){
            console.log(error);
        }else{
/*
	    var i = 0
	    while ( i < data.length){
		var tenData = []
		for (var j=0; j< 5; j++){
		    tenData.push(data[j])
		    i = i+1
		    res.json(tenData);
		}
	    }*/
	    res.json(data);
	    res.end
        }
    });

})

var KAISTsubject1 = mongoose.model('kaist2000_2',subject);

app.get('/KAIST1', (req,res)=>{
    KAISTsubject1.find(function(error, data){
	if (error){
	    console.log(error)
	}else{
	    res.json(data)
	    res.end
	}
    });
})

// get user detail




// login process

app.post('/login',(req,res)=>{
    console.log('who get in here/users');
    
    var inputData;
    req.on('data', (data)=>{
	inputData = JSON.parse(data);
	console.log(inputData.studentid)	
	
	col.findOne({ studentid : inputData.studentid},function(error,data){
	    console.log('read certain object')
	    console.log(data)
	    if(error){
		console.log(error)
	    }
	    else if(!data){
		res.write("empty")
		res.end()
	    }else if(inputData.password != data.password){
		res.write("loginfail")
		res.end()
	    }else{
		console.log(data.school)
		res.send(data.school)
		res.end()
	    }
	});
    });	
});


    



// server confirm

app.get('/confirm', (req,res)=>{
    console.log('server confirm')
    res.write("server confirm")
    res.end()
})




app.listen(80, () => {
    console.log('example app listening on port 80');
});
