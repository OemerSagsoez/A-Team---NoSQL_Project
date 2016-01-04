function getFromServer(path, callback) {
	$.ajax({
		url : path,
		//data : { param : "value" },
		dataType : 'json',
		type : 'get',
		success : function(data) {
			// called after the ajax has returned successful response
			callback(data); // alerts the response
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
			// called after the ajax has returned successful response
			callback(data); // alerts the response
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
			// called after the ajax has returned successful response
			callback(data); // alerts the response
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