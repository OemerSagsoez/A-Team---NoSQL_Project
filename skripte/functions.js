var allTeams = null;
var schedule = null;
var currentLeague = 1;
var currentGameday = 1;

var team = null;
var player = null;

/**
 * Executed everytime the index File is load
 */
function startPage() {
	getFromServer("/league/1/teams", showTeams);

	buildGamedayList();
	getFirstGameday();
	checkForOpenGame();
}

/**
 * Executed everytime the Team File is load
 */
function teamPage() {
	getFromServer("/teams/"+$_GET("team"), teamresponse);
}

/**
 * Fill the Dropdown on the Index Page with the Gamedays
 */
function buildGamedayList() {
	for(var i = 1; i < 35; i++) {
		var li = jQuery('<li/>', {}).appendTo('#scheduleList');
		jQuery('<a/>', {
			text: i+". Spieltag",
			onclick: "selectGameday(this);"
		}).appendTo(li);
	}
	$("#dropdownMenuGameday").html(currentGameday+". Spieltag <span class='caret'></span>");
}

/**
 * Shoe all Teams of data. The Method shows the Teamlogo
 */
function showTeams(data) {
	allTeams = data;
	$("#teams").empty();
	$.each(data, function(index, value) {
		jQuery('<div/>', {
			width: '40px',
			height: '40px',
			id: value.team_id+'div',
			class: 'left textcenter'
		}).appendTo('#teams');
		
		jQuery('<a/>', {
			href: 'teams.html?team='+value._id,
			id: value.team_id+'link'
		}).appendTo('#'+value.team_id+'div');

		jQuery('<img/>', {
			src: 'images/small/'+value.pic_id+'.png',
			width: '30px',
			height: '30px'
		}).mouseover(function(elem) {
			$( this ).animate({ width: "40px", height: "40px" }, 300);
		}).mouseout(function(elem) {
			$( this ).animate({ width: "30px", height: "30px" }, 300);
		}).appendTo('#'+value.team_id+'link');
	});
}

/**
 * Everytime a Gameday is selected of the Dropdown
 */
function selectLeague(elem, league) {
	$("#"+league+"LeagueTab").addClass("active");
	
	if(league == 1) {
		currentLeague = 1;
		$("#2LeagueTab").removeClass("active");
	} else {
		currentLeague = 2;
		$("#1LeagueTab").removeClass("active");
	}
	getFromServer("/league/"+currentLeague+"/teams", showTeams);
	getFirstGameday();
	getStandings();
}

/**
 * Display the Gameday
 */
function showGameday(data) {
	$("#spielplan").empty();
	$.each(data, function(index, value) {
		var divgame = jQuery('<div/>', {
			class: 'clearleft'
		}).appendTo('#spielplan');
		
		var div = jQuery('<div/>', {
			text: value.date+", "+value.time,
			style: "margin-right:10px;",
			class: 'game left textcenter'
		}).appendTo(divgame);
		
		var div = jQuery('<div/>', {
			width: '40px',
			height: '40px',
			class: 'game left textcenter'
		}).appendTo(divgame);
		
		var a = jQuery('<a/>', {
			href: 'teams.html?team='+value.home,
		}).appendTo(div);
		
		jQuery('<img/>', {
			src: "/images/small/"+picForTeamID(value.home)+".png",
			width: '30px',
			height: '30px'
		}).mouseover(function(elem) {
			$( this ).animate({ width: "40px", height: "40px" }, 300);
		}).mouseout(function(elem) {
			$( this ).animate({ width: "30px", height: "30px" }, 300);
		}).appendTo(a);
		
		jQuery('<div/>', {
			text: " "+value.homegoals+" : "+value.awaygoals+" ",
			class: 'left marginhorizontal'
		}).appendTo(divgame);
		
		var div = jQuery('<div/>', {
			width: '40px',
			height: '40px',
			class: 'game left textcenter'
		}).appendTo(divgame);
		
		var a = jQuery('<a/>', {
			href: 'teams.html?team='+value.away,
		}).appendTo(div);
		
		jQuery('<img/>', {
			src: "/images/small/"+picForTeamID(value.away)+".png",
			width: '30px',
			height: '30px'
		}).mouseover(function(elem) {
			$( this ).animate({ width: "40px", height: "40px" }, 300);
		}).mouseout(function(elem) {
			$( this ).animate({ width: "30px", height: "30px" }, 300);
		}).appendTo(a);
		
		var div = jQuery('<div/>', {
			text: " in "+getCityOfTeam(value.home),
			style: "margin-left:10px;",
			class: 'game left textcenter'
		}).appendTo(divgame);
		
	});
}

/**
 * Return the Pic ID for the parameter. The Function need the field allTeams
 */
function picForTeamID(teamid) {
	if(allTeams == null) {
		getFromServer("/teams", function(data) {
			allTeams = data;
			for(var i = 0; i < allTeams.length; i++) {
				if(allTeams[i]._id == teamid) { return allTeams[i].pic_id; }
			}
		});
	} else {
		for(var i = 0; i < allTeams.length; i++) {
			if(allTeams[i]._id == teamid) { return allTeams[i].pic_id; }
		}
	}
}

/**
 * Return the Name for the parameter. The Function need the field allTeams
 */
function nameForTeamID(teamid) {
	if(allTeams == null) {
		getFromServer("/teams", function(data) {
			allTeams = data;
			for(var i = 0; i < allTeams.length; i++) {
				if(allTeams[i]._id == teamid) { return allTeams[i].name; }
			}
		});
	} else {
		for(var i = 0; i < allTeams.length; i++) {
			if(allTeams[i]._id == teamid) { return allTeams[i].name; }
		}
	}
}

function getCityOfTeam(teamid) {
	if(allTeams == null) {
		getFromServer("/teams", function(data) {
			allTeams = data;
			for(var i = 0; i < allTeams.length; i++) {
				if(allTeams[i]._id == teamid) { return allTeams[i].city; }
			}
		});
	} else {
		for(var i = 0; i < allTeams.length; i++) {
			if(allTeams[i]._id == teamid) { return allTeams[i].city; }
		}
	}
}

/**
 * Display the current Gameday in the Dropdown
 */
function selectGameday(element) {
	var gameday = element.innerHTML.slice(0, element.innerHTML.indexOf("."));
	currentGameday = parseInt(gameday);
	getFromServer("/schedule/"+currentLeague+"/"+gameday, showGameday);
	$("#dropdownMenuGameday").html(currentGameday+". Spieltag <span class='caret'></span>");
}

/**
 * Get the First Gameday and display it
 */
function getFirstGameday() {
	currentGameday = 1;
	$("#dropdownMenuGameday").html(currentGameday+". Spieltag <span class='caret'></span>");
	getFromServer("/schedule/"+currentLeague+"/1", showGameday);
}

/**
 * Check if Gamedays need to simulate
 */
function checkForOpenGame() {
	getFromServer("/schedule", function(data) {
		var now = new Date();
		$.each(data, function(index, value) {
			var date = value.date.split(".");
			var time = value.time.split(":");
			var gametime = new Date(parseInt(date[2]), parseInt(date[1])-1, parseInt(date[0]), parseInt(time[0]), parseInt(time[1]), 0);
			
			if(now.getTime() > gametime.getTime() && value.played != "true") { 
				simulateGame(value);
			} 
			/*if(now.getTime() < gametime.getTime()) {
				var json = '{"homegoals": "-", "awaygoals": "-", "goals": "", "played": "false"}';
				putToServer("schedule/"+value._id, json, function() {});
			
			}*/
		});
		
		
	});
}

/**
 * Simulate a Game with the ID of the Parameter
 */
function simulateGame(game) {
	var hometeam, awayteam;
	getFromServer("/teams/"+game.home+"/roster", function(data) {
		hometeam = data;
		getFromServer("/teams/"+game.away+"/roster", function(data) {
			awayteam = data;
			
			var home = Math.round(Math.random() * (5 - 0)) + 0;
			var away = Math.round(Math.random() * (5 - 0)) + 0;
			var goals = new Array();
			for(var i = 0; i < home; i++) {
				var player = Math.round(Math.random() * (hometeam.length-1 - 0)) + 0;
				goals.push(hometeam[player]._id);
				putToServer("/roster/"+hometeam[player]._id+"/goal", json, function() {})
			}
			for(var i = 0; i < away; i++) {
				var player = Math.round(Math.random() * (awayteam.length-1 - 0)) + 0;
				goals.push(awayteam[player]._id);
				putToServer("/roster/"+awayteam[player]._id+"/goal", json, function() {})
			}
			var json = '{"homegoals": "'+home+'", "awaygoals": "'+away+'", "goals": "'+goals+'", "played": "true"}';
			putToServer("schedule/"+game._id, json, function() {});
			
		});
	});
}

/**
 * Execute if a Tab of a Team is clicked
 */
function selectInfo(element, data) {
	$("#leagueinfolist li").removeClass("active");
	$(element).parent().addClass("active");

	if(data == "schedule") {
		$("#schedule").css("display", "inline");
		$("#standings").css("display", "none");
		getFirstGameday();
	} else if(data == "standings") {
		$("#schedule").css("display", "none");
		$("#standings").css("display", "inline");
		getStandings();
	}
}

/**
 * Write all Infos for the Standings in an Array and show it
 */
function getStandings() {
	getFromServer("/schedule/"+currentLeague, function(data) {
		var table = new Array();
		$.each(allTeams, function(index, value) {
			table[value._id] = {
				win: 0,
				tie: 0,
				loss: 0,
				goals:0,
				goalsagainst: 0,
				points: 0
			};
		});
		var now = new Date();
		$.each(data, function(index, value) {
			var date = value.date.split(".");
			var time = value.time.split(":");
			var gametime = new Date(date[2], date[1]-1, date[0], time[0], time[1], 0);
			
			if(value.played == "true") {
				table[value.home]["goals"] += parseInt(value.homegoals);
				table[value.home]["goalsagainst"] += parseInt(value.awaygoals);
				table[value.away]["goals"] += parseInt(value.awaygoals);
				table[value.away]["goalsagainst"] += parseInt(value.homegoals);
				if(value.homegoals > value.awaygoals) {
					table[value.home]["win"]++;
					table[value.home]["points"]+=3;
					table[value.away]["loss"]++;
				} else if(value.homegoals < value.awaygoals) {
					table[value.home]["loss"]++;
					table[value.away]["win"]++;
					table[value.away]["points"]+=3;
				} else {
					table[value.home]["tie"]++;
					table[value.away]["tie"]++;
					table[value.home]["points"]++;
					table[value.away]["points"]++;
				}
			}
		});
		table = sortTable(table);
		showTable(table);
	});
}

/**
 * Sort the Array of the Standings with an Insertion Sort
 */
function sortTable(table) {
	var rank = new Array();
	var i = 0;
	$.each(allTeams, function(index, value){
		rank[i] = table[value["_id"]];
		rank[i]["id"] = value["_id"];
		i++;
	});
	var h = null;
	for (i = 0; i < 18-1; i++) {
		for (j = i + 1; j < 18; j++) {
			if (teamIsBetter(rank[j], rank[i])) {
				h = rank[i];
				rank[i] = rank[j];
				rank[j] = h;
			} else if ((rank[j]["points"] == rank[i]["points"]) && (rank[j]["goals"] - rank[j]["goalsagains"] > rank[i]["goals"] - rank[i]["goalsagains"])) {
				h = rank[i];
				rank[i] = rank[j];
				rank[j] = h;
			}
		}
	}
	return rank;
}

/**
 * Desides if a Team is better than another
 */
function teamIsBetter(firstteam, secondteam) {
	if(firstteam["points"] > secondteam["points"]) {
		return true;
	} else if((firstteam["points"] == secondteam["points"]) &&
			(parseInt(firstteam["goals"])-parseInt(firstteam["goalsagainst"]) > parseInt(secondteam["goals"])-parseInt(secondteam["goalsagainst"]))) {
		return true;
	}else if((firstteam["points"] == secondteam["points"]) &&
			(parseInt(firstteam["goals"])-parseInt(firstteam["goalsagainst"]) == parseInt(secondteam["goals"])-parseInt(secondteam["goalsagainst"])) &&
			(parseInt(firstteam["goals"]) > parseInt(secondteam["goals"]))) {
		return true;
	} else {
		return false
	}
}

/**
 * Display the Standing in a Table
 */
function showTable(table) {
	$("#standingbody").empty();
	$.each(table, function(index, value) {
		var tr = jQuery('<tr/>', {}).appendTo("#standingbody");
		jQuery('<td/>', {
			text: index+1
		}).appendTo(tr);
		
		var td = jQuery('<td/>', {}).appendTo(tr);
		var a = jQuery('<a/>', {
			href: 'teams.html?team='+value.id,
		}).appendTo(td);
		
		jQuery('<img/>', {
			src: "/images/small/"+picForTeamID(value.id)+".png",
			width: '30px',
			height: '30px'
		}).appendTo(a);
		
		jQuery('<td/>', {
			text: value.win
		}).appendTo(tr);
		jQuery('<td/>', {
			text: value.loss
		}).appendTo(tr);
		jQuery('<td/>', {
			text: value.tie
		}).appendTo(tr);
		jQuery('<td/>', {
			text: value.goals
		}).appendTo(tr);
		jQuery('<td/>', {
			text: value.goalsagainst
		}).appendTo(tr);
		jQuery('<td/>', {
			text: value.goals-value.goalsagainst
		}).appendTo(tr);
		jQuery('<td/>', {
			text: value.points
		}).appendTo(tr);
		
	});
}

/**
 * Display a Team
 */
function teamresponse(data) {
	team = data;
	$('#teamlogo').attr("src", "images/small/"+data.pic_id+".png");
	$('#teaminfo').append(data.name);
	$('#teaminfo').append("<br><br><span class='bold'>Trainer:</span> "+data.coach);
	getTeamRoster(showTeamRoster);
}

/**
 * Executed if a Info of a Team is selected
 */
function selectTeamInfo(element, data) {
	$("#teamTab").removeClass("active");
	$("#spielplanTab").removeClass("active");
	$("#"+data+"Tab").addClass("active");
	var league = "scheduleLeagueOne";
	if(team.league == 2) { league = "scheduleLeagueTwo" }
	
	if(data == "team") getTeamRoster(showTeamRoster);
	if(data == "spielplan") getFromServer("/schedule/"+team.league, showTeamSchedule);
}

/**
 * Gets the Team Roster and call the callback Method
 */
function getTeamRoster(callback) {
	if(player == null) {
		getFromServer("/teams/"+$_GET("team")+"/roster", function(data) {
			player = data;
			callback(data);
		});
	} else {
		callback(player);
	}
}

/**
 * Display the Roster of a Team
 */
function showTeamRoster(data) {
	$('#teaminfobox').empty();
	//Build Table
	var table = jQuery('<table/>', {
		id: "teamplayertable",
		class: "table"
	}).appendTo('#teaminfobox');
	var tr = jQuery('<tr/>', {
	}).appendTo(table);
	jQuery('<th/>', {
		text: "Vorname"
	}).appendTo(tr);
	jQuery('<th/>', {
		text: "Nachname"
	}).appendTo(tr);
	jQuery('<th/>', {
		text: "#"
	}).appendTo(tr);
	jQuery('<th/>', {
		text: "Position"
	}).appendTo(tr);
	jQuery('<th/>', {
		text: "Tore"
	}).appendTo(tr);
		
	//Show Players
	$.each(data, function(index, value) {
		var tr = jQuery('<tr/>', {
		}).appendTo(table);
		
		jQuery('<td/>', {
			text: value.firstname
		}).appendTo(tr);
		jQuery('<td/>', {
			text: value.surname
		}).appendTo(tr);
		jQuery('<td/>', {
			text: value.number
		}).appendTo(tr);
		jQuery('<td/>', {
			text: value.position
		}).appendTo(tr);
		jQuery('<td/>', {
			text: value.goals
		}).appendTo(tr);
	});
}

/**
 * Display the Schedule of a Team
 */
function showTeamSchedule(data) {
	getFromServer("/teams", function(dataTeams) {	// Need for the picture ID's
		allTeams = dataTeams;
		$('#teaminfobox').empty();
		$.each(data, function(index, value) {
			if(value.home == team._id || value.away == team._id) {
				var divgame = jQuery('<div/>', {
					class: 'clearleft'
				}).appendTo('#teaminfobox');

				jQuery('<div/>', {
					text: value.date+", "+value.time,
					class: 'left'
				}).appendTo(divgame);
				
				var div = jQuery('<div/>', {
					width: '40px',
					height: '40px',
					class: 'game left textcenter'
				}).appendTo(divgame);
				
				var a = jQuery('<a/>', {
					href: 'teams.html?team='+value.home,
				}).appendTo(div);
				
				jQuery('<img/>', {
					src: "/images/small/"+picForTeamID(value.home)+".png",
					width: '30px',
					height: '30px'
				}).mouseover(function(elem) {
					$( this ).animate({ width: "40px", height: "40px" }, 300);
				}).mouseout(function(elem) {
					$( this ).animate({ width: "30px", height: "30px" }, 300);
				}).appendTo(a);
				
				jQuery('<div/>', {
					text: " "+value.homegoals+" : "+value.awaygoals+" ",
					class: 'left marginhorizontal'
				}).appendTo(divgame);
				
				var div = jQuery('<div/>', {
					width: '40px',
					height: '40px',
					class: 'game left textcenter'
				}).appendTo(divgame);
				
				var a = jQuery('<a/>', {
					href: 'teams.html?team='+value.away,
				}).appendTo(div);
				
				jQuery('<img/>', {
					src: "/images/small/"+picForTeamID(value.away)+".png",
					width: '30px',
					height: '30px'
				}).mouseover(function(elem) {
					$( this ).animate({ width: "40px", height: "40px" }, 300);
				}).mouseout(function(elem) {
					$( this ).animate({ width: "30px", height: "30px" }, 300);
				}).appendTo(a);
			}
		});
	});
}