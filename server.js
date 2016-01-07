var http = require('http'),
    express = require('express'),
    path = require('path'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    CollectionDriver = require('./collectionDriver').CollectionDriver,
	bodyParser = require('body-parser');;
 
var app = express();
app.set('port', process.env.PORT || 3000); 

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
var mongoUrl = 'mongodb://localhost:27017/Scrambler'; 
var collectionDriver;
 
MongoClient.connect(mongoUrl, function(err, db) { 
  if (!db) {
      console.error("Error! Exiting... Must start MongoDB first");
      process.exit(1); 
  }
  collectionDriver = new CollectionDriver(db);
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/teams.html', function (req, res) {
	res.sendFile('teams.html');
});

app.get('/create_update.html', function (req, res) {
	res.sendFile('create_update.html');
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
});

app.get('/images/:file', function (req, res) {
	var params = req.params;
	var file = params.file;
	res.sendFile(__dirname + '/images/'+file);
});

app.get('/images/small/:file', function (req, res) {
	var params = req.params;
	var file = params.file;
	res.sendFile(__dirname + '/images/small/'+file);
});

app.get('/teams/:team/:info', function (req, res) {
	var params = req.params;
	var team = params.team;
	var info = params.info;
	var collection = info;
	if (team && info) {
		var search = "";
		if(info == "roster") {
			search = {"teamid": team};
		} else if(info == "schedule") {
			search = {"home": team, "away":team};
		}
		collectionDriver.getInfoOfTeam(collection, search, function(error, objs) { //J
		if (error) { res.status(460).send(error); }
		else { 
			if(objs == null) {
				res.status(404).send({error: 'entity not found', url: req.url});
			} else {
				res.status(200).json(objs); //H
			}
		}
	   });
	} else {
	  res.status(400).send({error: 'bad url', url: req.url});
	}
});

app.get('/league/:league/teams', function (req, res) {
	var params = req.params;
	var league = params.league;
	var collection = "teams";
	if (league) {
	   collectionDriver.getTeamByField(collection, {"league": league}, function(error, objs) { //J
		if (error) { res.status(460).send(error); }
		else { 
			if(objs == null) {
				res.status(404).send({error: 'entity not found', url: req.url});
			} else {
				res.status(200).json(objs); 
			}
		} 
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
	   collectionDriver.getSchedule(collection, {"league": league, "gameday": parseInt(gameday)}, function(error, objs) { //J
		if (error) { res.status(460).send(error); }
		else { 
			if(objs == null) {
				res.status(404).send({error: 'entity not found', url: req.url});
			} else {
				res.status(200).json(objs);
			}
		} 
	   });
	} else {
	  res.status(400).send({error: 'bad url', url: req.url});
	}
});

app.get('/schedule/:league', function (req, res) {
	var params = req.params;
	var league = params.league;
	var collection = "schedule";
	if (league) {
		collectionDriver.getSchedule(collection, {"league": league}, function(error, objs) {
			if (error) { res.status(460).send(error); }
			else { 
				if(objs == null) {
					res.status(404).send({error: 'entity not found', url: req.url});
				} else {
					res.status(200).json(objs); 
				}
			} 
		});
	} else {
		res.status(400).send({error: 'bad url', url: req.url});
	}
});

app.get('/:collection/:entity', function(req, res) { //I
	var params = req.params;
	var entity = params.entity;
	var collection = params.collection;
	if (entity) {
		collectionDriver.get(collection, entity, function(error, objs) { //J
			if (error) { res.status(460).send(error); }
			else { 
				if(objs != null) {
					res.status(200).send(objs); 
				} else {
					res.status(404).send({error: 'entity not found', url: req.url});
				}
			}
		});
	} else {
		res.status(400).send({error: 'bad url', url: req.url});
	}
});

app.get('/:collection', function(req, res) { 
	var params = req.params; 
	collectionDriver.findAll(req.params.collection, function(error, objs) { 
    	if (error) { res.status(460).send(error); } 
	    else { 
            if(objs != null) {
				res.status(200).send(objs); 
			} else {
				res.status(404).send({error: 'entity not found', url: req.url});
			}
        }
   	});
});

app.post('/:collection', function(req, res) { 
    var object = req.body;
    var collection = req.params.collection;
    collectionDriver.save(collection, object, function(err,docs) {
		  if (err) { res.status(400).send(err); } 
          else { res.status(201).send(docs); } 
     });
});

app.put('/roster/:player/goal', function(req, res) { 
    var params = req.params;
    var player = params.player;
    var collection = "roster";
    if (player) {
       collectionDriver.goalForPlayer(collection, {$inc: { goals: 1 }}, player, function(error, objs) { 
          if (error) { res.status(400).send(error); }
          else { res.status(200).send(objs); } 
       });
   } else {
	   var error = { "message" : "Cannot PUT a whole collection" }
	   res.status(400).send(error);
   }
});

app.put('/:collection/:entity', function(req, res) { 
    var params = req.params;
    var entity = params.entity;
    var collection = params.collection;
    if (entity) {
       collectionDriver.update(collection, req.body, entity, function(error, objs) { 
          if (error) { res.status(400).send(error); }
          else { res.status(200).send(objs); } 
       });
   } else {
	   var error = { "message" : "Cannot PUT a whole collection" }
	   res.status(400).send(error);
   }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});