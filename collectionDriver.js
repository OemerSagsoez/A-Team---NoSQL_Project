var ObjectID = require('mongodb').ObjectID;

CollectionDriver = function(db) {
  this.db = db;
};

CollectionDriver.prototype.getCollection = function(collectionName, callback) {
  this.db.collection(collectionName, function(error, the_collection) {
    if( error ) callback(error);
    else callback(null, the_collection);
  });
};

//find all objects for a collection
CollectionDriver.prototype.findAll = function(collectionName, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
      if( error ) callback(error)
      else {
        the_collection.find().toArray(function(error, results) { //B
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//find a specific object
CollectionDriver.prototype.get = function(collectionName, id, callback) { //A
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error)
        else {
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$"); //B
            if (!checkForHexRegExp.test(id)) callback({error: "invalid id"});
            else the_collection.findOne({'_id':ObjectID(id)}, function(error,doc) { //C
            	if (error) callback(error)
            	else callback(null, doc);
            });
        }
    });
}

CollectionDriver.prototype.getInfoOfTeam = function(collectionName, search, callback) { //A
	var sort = "";
	if(collectionName == "roster") {
		sort = {position: 1};
	} else if(collectionName == "schedule") {
		sort = {gameday: 1};
	}
	this.getCollection(collectionName, function(error, the_collection) {
        if (error) {
			callback(error)
        }
		else {
            //var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$"); //B	// Nur Team Namen zulassenn
			checkForHexRegExp = true;
            /*if (!checkForHexRegExp.test(id)) {
				callback({error: "invalid id"});
			}
            else */
			the_collection.find(search).sort(sort).toArray(function(error, results) { //B
			  if( error ) callback(error)
			  else callback(null, results)
			});
        }
    });
}

CollectionDriver.prototype.getSchedule = function(collectionName, search, callback) { //A
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) {
			callback(error)
        }
		else {
			the_collection.find(search).sort({gameday: 1}).toArray(function(error, results) { //B
			  if( error ) callback(error)
			  else callback(null, results)
			});
        }
    });
}


//find Teams in a League
CollectionDriver.prototype.getTeamByField = function(collectionName, search, callback) { //A
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) {
			callback(error)
        }
		else {
            //var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$"); //B	// Nur Team Namen zulassenn
			checkForHexRegExp = true;
            /*if (!checkForHexRegExp.test(id)) {
				callback({error: "invalid id"});
			}
            else */
			the_collection.find(search).toArray(function(error, results) { //B
			  if( error ) callback(error)
			  else callback(null, results)
			});
        }
    });
}

//save new object
CollectionDriver.prototype.save = function(collectionName, obj, callback) {
	this.getCollection(collectionName, function(error, the_collection) { //A
      if( error ) callback(error)
      else {
        obj.created_at = new Date(); //B
        the_collection.save(obj, function(err, saved) { //C
          callback(null, obj);
        });
      }
    });
};

//update a specific object
CollectionDriver.prototype.update = function(collectionName, obj, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error)
        else {
	        //obj._id = ObjectID(entityId); //A convert to a real obj id
	        obj.updated_at = new Date(); //B
            the_collection.updateOne({"_id":ObjectID(entityId)}, {$set: obj}, function(error,doc) { //C
            	if (error) callback(error)
            	else callback(null, obj);
            });
        }
    });
}

CollectionDriver.prototype.goalForPlayer = function(collectionName, obj, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error)
        else {
            the_collection.updateOne({"_id":ObjectID(entityId)}, obj, function(error,doc) { //C
            	if (error) callback(error)
            	else callback(null, obj);
            });
        }
    });
}

//delete a specific object
CollectionDriver.prototype.delete = function(collectionName, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) { //A
        if (error) callback(error)
        else {
            the_collection.remove({'_id':ObjectID(entityId)}, function(error,doc) { //B
            	if (error) callback(error)
            	else callback(null, doc);
            });
        }
    });
}

exports.CollectionDriver = CollectionDriver;