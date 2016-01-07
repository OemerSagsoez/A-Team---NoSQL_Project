function getFromServer(path, callback) {
	$.ajax({
		url : path,
		dataType : 'json',
		type : 'get',
		success : function(data) {
			callback(data);
		},
		error : function(object, errorstring) {
			var massage = "";
			if(object.status == 404) {	// Object not found
				massage = "Das gewünschte Objekt wurde nicht gefunden";
			} else if(object.status == 400) {	// Failure in URL
				massage = "Ihre eingabe ist ungültig";
			} else if(object.status == 460) {	// Error with Database
				massage = "Es gab einen Fehler mit der Datenbank!";
			}
			showError(object.status, massage);
		}
	});
}

function postToServer(path, json, callback) {
	$.ajax({
		contentType: 'application/json',
		url : path,
		data : json,
		dataType : 'json',
		type : 'post',
		success : function(data) {
			callback(data);
		}
	});
}

function putToServer(path, json, callback) {
	$.ajax({
		contentType: 'application/json',
		url : path,
		data : json,
		dataType : 'json',
		type : 'put',
		success : function(data) {
			callback(data); 
		}
	});
}

function $_GET(param) {
	var vars = {};
	window.location.href.replace( 
		/[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
		function( m, key, value ) { // callback
			vars[key] = value !== undefined ? value : '';
		}
	);

	if ( param ) {
		return vars[param] ? vars[param] : null;	
	}
	return vars;
}

function showError(status, massage) {
	$('body').empty();
	jQuery('<div/>', {
		class: 'alert alert-danger',
		text: massage
	}).appendTo('body');
}