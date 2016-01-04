var http = require('http'),
    express = require('express'),
    path = require('path'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    CollectionDriver = require('./collectionDriver').CollectionDriver,
	bodyParser = require('body-parser');;
 
var app = express();
app.set('port', process.env.PORT || 3000); 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
var mongoUrl = 'mongodb://localhost:27017/Scrambler'; //A
var collectionDriver;
 
MongoClient.connect(mongoUrl, function(err, db) { //C
  if (!db) {
      console.error("Error! Exiting... Must start MongoDB first");
      process.exit(1); //D
  }
  collectionDriver = new CollectionDriver(db); //F
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
	//res.send('<html><body><h1>Hello World</h1></body></html>');
});

app.get('/teams.html', function (req, res) {
	res.sendFile('teams.html');
	//res.send('<html><body><h1>Hello World</h1></body></html>');
});

app.get('/create_update.html', function (req, res) {
	res.sendFile('create_update.html');
	//res.send('<html><body><h1>Hello World</h1></body></html>');
});

app.get('/skripte/:file', function (req, res) {
	var params = req.params;
	var file = params.file;
	res.sendFile(__dirname + '/skripte/'+file);
});

app.get('/css/:file', function (req, res) {
	var params = req.params;
	var file = params.file;
	res.sendFile(__dirname + '/css/'+file);
	//res.send('<html><body><h1>Hello World</h1></body></html>');
});

app.get('/images/small/:file', function (req, res) {
	var params = req.params;
	var file = params.file;
	res.sendFile(__dirname + '/images/small/'+file);
	//res.send('<html><body><h1>Hello World</h1></body></html>');
});



app.get('/teams/:entity', function (req, res) {
	var params = req.params;
	var entity = params.entity;
	var collection = "teams";
	if (entity) {
	   collectionDriver.getTeam(collection, entity, function(error, objs) { //J
		if (error) { res.status(400).send(error); }
		else { 
			if(objs == null) {
				res.status(434).render('434', error);
			} else {
				/*if (req.accepts('html')) { //E
					console.log("test1");
					res.status(200).render('team', {objects:objs});
				} else {*/
					//res.set('Content-Type','application/json'); //G
					res.status(200).json(objs); //H
				//}
			
				
			}
		} //K
	   });
	} else {
	  res.status(400).send({error: 'bad url', url: req.url});
	}
});

app.get('/teams/:team/schedule', function (req, res) {
	var params = req.params;
	var team = params.team;
	var collection = "schedule";
	if (team) {
	   collectionDriver.getScheduleOfTeam(collection, {"home": team, "away":team}, function(error, objs) { //J
		if (error) { res.status(400).send(error); }
		else { 
			if(objs == null) {
				res.status(434).render('434', error);
			} else {
				/*if (req.accepts('html')) { //E
					console.log("test1");
					res.status(200).render('team', {objects:objs});
				} else {*/
					//res.set('Content-Type','application/json'); //G
					res.status(200).json(objs); //H
				//}
			
				
			}
		} //K
	   });
	} else {
	  res.status(400).send({error: 'bad url', url: req.url});
	}
});

app.get('/teams/league/:league', function (req, res) {
	var params = req.params;
	var league = params.league;
	console.log(league);
	var collection = "teams";
	if (league) {
	   collectionDriver.getTeamByField(collection, {"league": league}, function(error, objs) { //J
		if (error) { res.status(400).send(error); }
		else { 
			if(objs == null) {
				res.status(434).render('434', error);
			} else {
				/*if (req.accepts('html')) { //E
					console.log("test1");
					res.status(200).render('team', {objects:objs});
				} else {*/
					//res.set('Content-Type','application/json'); //G
					res.status(200).json(objs); //H
				//}
			
				
			}
		} //K
	   });
	} else {
	  res.status(400).send({error: 'bad url', url: req.url});
	}
});

app.get('/schedule/:league/:gameday', function (req, res) {
	var params = req.params;
	var league = params.league;
	var gameday = params.gameday;
	var collection = "schedule";
	if (league && gameday) {
	   collectionDriver.getSchedule(collection, {"league": league, "gameday": gameday}, function(error, objs) { //J
		if (error) { res.status(400).send(error); }
		else { 
			if(objs == null) {
				res.status(434).render('434', error);
			} else {
				/*if (req.accepts('html')) { //E
					console.log("test1");
					res.status(200).render('team', {objects:objs});
				} else {*/
					//res.set('Content-Type','application/json'); //G
					res.status(200).json(objs); //H
				//}
			
				
			}
		} //K
	   });
	} else {
	  res.status(400).send({error: 'bad url', url: req.url});
	}
});

app.get('/schedule/:league', function (req, res) {
	console.log("test");
	var params = req.params;
	var league = params.league;
	var collection = "schedule";
	if (league) {
	   collectionDriver.getSchedule(collection, {"league": league}, function(error, objs) { //J
		if (error) { res.status(400).send(error); }
		else { 
			if(objs == null) {
				res.status(434).render('434', error);
			} else {
				/*if (req.accepts('html')) { //E
					console.log("test1");
					res.status(200).render('team', {objects:objs});
				} else {*/
					//res.set('Content-Type','application/json'); //G
					res.status(200).json(objs); //H
				//}
			
				
			}
		} //K
	   });
	} else {
	  res.status(400).send({error: 'bad url', url: req.url});
	}
});

app.get('/:collection', function(req, res) { //A
   var params = req.params; //B
   collectionDriver.findAll(req.params.collection, function(error, objs) { //C
    	  if (error) { res.status(400).send(error); } //D
	      else { 
	          /*if (req.accepts('html')) { //E
    	          res.render('data',{objects: objs, collection: req.params.collection}); //F
              } else {
				res.set('Content-Type','application/json'); //G*/
                  res.status(200).send(objs); //H
              //}
         }
   	});
});
 /*
app.get('/:collection/:entity', function(req, res) { //I
   var params = req.params;
   var entity = params.entity;
   var collection = params.collection;
   if (entity) {
       collectionDriver.get(collection, entity, function(error, objs) { //J
          if (error) { res.status(400).send(error); }
          else { res.status(200).send(objs); } //K(
       });
   } else {
      res.status(400).send({error: 'bad url', url: req.url});
   }
});
*/
app.post('/:collection', function(req, res) { //A

    var object = req.body;
    var collection = req.params.collection;
    collectionDriver.save(collection, object, function(err,docs) {
		  if (err) { res.status(400).send(err); } 
          else { res.status(201).send(docs); } //B
     });
});

app.put('/:collection/:entity', function(req, res) { //A
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
       collectionDriver.update(collection, req.body, entity, function(error, objs) { //B
          if (error) { res.status(400).send(error); }
          else { res.status(200).send(objs); } //C
       });
   } else {
	   var error = { "message" : "Cannot PUT a whole collection" }
	   res.status(400).send(error);
   }
});

app.delete('/:collection/:entity', function(req, res) { //A
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
       collectionDriver.delete(collection, entity, function(error, objs) { //B
          if (error) { res.status(400).send(error); }
          else { res.status(200).send(objs); } //C 200 b/c includes the original doc
       });
   } else {
       var error = { "message" : "Cannot DELETE a whole collection" }
       res.status(400).send(error);
   }
});
 /*
app.use(function (req,res) {
    res.render('404', {url:req.url});
});
*/
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});