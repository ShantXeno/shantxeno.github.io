
function generateBoardUrl() {  
  
	// Get squares.xml
	
	var Connect = new XMLHttpRequest();
	Connect.open("GET", "squares.xml", false);
	Connect.setRequestHeader("Content-Type", "text/xml");
	Connect.send(null);

	var response = Connect.responseXML;
	var squares = response.childNodes[0];
	
	// Get domains.xml
	
	var Connect = new XMLHttpRequest();
	Connect.open("GET", "domains.xml", false);
	Connect.setRequestHeader("Content-Type", "text/xml");
	Connect.send(null);

	var response = Connect.responseXML;
	var domains = response.childNodes[0];
	
	// Init url
	boardURL = "board.html?";
	
	// Build list of immunities
	immuneTable = document.getElementsByName("immuneTable");
	
	boardURL += "exclude="; 
	excludeList = "";
	
	for (i = 0; i < immuneTable.length; i++) {
		if (immuneTable[i].checked) {
			if (excludeList == "") { excludeList = immuneTable[i].value; }
			else { excludeList = immuneTable[i].value + "," + excludeList; }
		}
	}
	
	boardURL += excludeList;
	
	// Add length to url
	boardURL += "&timeN=" + document.getElementById("timeNum").value;
	boardURL += "&timeU=" + document.getElementById("timeUnit").value;
	
	// Get random domain
	faeNum = Math.floor(Math.random() * (domains.children.length));
	
	while (isAnyTagInList(domains.children[faeNum], excludeList)) {
		faeNum = Math.floor(Math.random() * (domains.children.length));
	}
	
	boardURL += "&domain=" + firstToString(domains.children[faeNum], "num"); 
	
	// Get random reward
	if (document.getElementById("getReward").checked) {
		
	rwdNum = Math.floor(Math.random() * (domains.children.length));
	numRewards = domains.children[faeNum].getElementsByTagName("reward").length;
	
	boardURL += "&reward=" + Math.floor(Math.random() * numRewards); 
	
	} else {
		
	boardURL += "&reward=X";
		
	}
	
	// Get number of squares
	numSquares = parseInt(document.getElementById("squaresNum").value);
	if (isNaN(numSquares)) { numSquares = parseInt(document.getElementById("squaresNum").min); }
	
	// Build list of squares
	boardURL += "&squares="; 
	
	for (i = 0; i < numSquares; i++) {
	
		sqNum = Math.floor(Math.random() * (squares.children.length));
		
		currentSq = squares.children[sqNum];
		
		sqTags = currentSq.getElementsByTagName("tag");
		
		if (isAnyTagInList(sqTags, excludeList)) {
			i--;
		} else {
			boardURL += firstToString(currentSq, "num");
			if (i != numSquares - 1) { boardURL += ","; }
		}
	
	}
	
	// Display link
	document.getElementById("boardLink").innerHTML = "<a href='" + boardURL + "'>FAEMANJI !</a>";
	
}

function displayDomain() {

	var Connect = new XMLHttpRequest();
	Connect.open("GET", "domains.xml", false);
	Connect.setRequestHeader("Content-Type", "text/xml");
	Connect.send(null);

	var response = Connect.responseXML;
	var domains = response.childNodes[0];
	
	params = new URLSearchParams(window.location.search);
	
	faeId = parseInt(params.get("domain"), 16) - 1;
	rwdNum = params.get("reward");
	faeAll = domains.children[faeId];
	
	document.getElementById("faeName").innerHTML = "Domaine de " + firstToString(faeAll, "name");
	document.getElementById("faeText").innerHTML = firstToString(faeAll, "text");
	document.getElementById("faeDouble").innerHTML = "<b>Quiconque obtient un double avec les dés</b> " + firstToString(faeAll, "double");
	document.getElementById("faeSeven").innerHTML = "<b>Quiconque obtient un sept avec les dés</b> " + firstToString(faeAll, "seven");
	
	if (rwdNum != "X") {
		rwdNum = parseInt(rwdNum);
		rwdSelected = faeAll.getElementsByTagName("reward")[rwdNum];
		document.getElementById("faeReward").innerHTML = "<b>Quiconque sur la dernière case s'exclame \"Faemanji\"</b> " + rwdSelected.innerHTML.toString() + "<br><br>";
		displayRwdCount(rwdSelected.getAttribute("cost"), rwdSelected.getAttribute("unit"));
		document.getElementById("immuneField").setAttribute("onchange", "displayRwdCount('" + rwdSelected.getAttribute("cost") + "','" + rwdSelected.getAttribute("unit") + "')");
	} else {
		document.getElementById("faeReward").remove();
	}
	
	timeN = parseInt(params.get("timeN"));
	timeU = params.get("timeU");
	
	if (timeU == "inf") {
		document.getElementById("faeTime").innerHTML = "<i>Tout effet subi subsistera de façon permanente après la fin de la partie.</i>";
	} else if (timeN == "0") {
		document.getElementById("faeTime").innerHTML = "<i>Tout effet subi se dissipera immédiatement après la fin de la partie.</i>";
	} else {
		document.getElementById("faeTime").innerHTML = "<i>Tout effet subi subsistera pendant une durée de " + timeN + " " + unitToString(timeU, timeN) + " après la fin de la partie.</i>";
	}
	
}

function displayBoard() {
	
	var Connect = new XMLHttpRequest();
	Connect.open("GET", "squares.xml", false);
	Connect.setRequestHeader("Content-Type", "text/xml");
	Connect.send(null);

	var response = Connect.responseXML;
	var squares = response.childNodes[0];
	
	params = new URLSearchParams(window.location.search);
	
	squareList = params.get("squares").split(",");
	
	document.getElementById("gameBoard").innerHTML += '<td style="height:80px; width:80px; border:solid 1px; display: inline-block; text-align:center; padding:2px;"><h2>' + "D" + '</h2></td>';
	
	for (i = 0; i < squareList.length; i++) {
		
		sqNum = parseInt(squareList[i], 16) - 1;
		
		document.getElementById("gameBoard").innerHTML += '<td style="height:80px; width:80px; border:solid 1px; display: inline-block; text-align:center; padding:2px;" onclick="squareShow(' + (i+1) + "," + sqNum + ')"><h2>' + (i+1) + '</h2></td>';
		
	}
	
	document.getElementById("gameBoard").innerHTML += '<td style="height:80px; width:80px; border:solid 1px; display: inline-block; text-align:center; padding:2px;"><h2>' + "A" + '</h2></td>';
	
}

function hideCommonImmunities() {
	
	params = new URLSearchParams(window.location.search);
	
	excludeList = params.get("exclude").split(",");
	
	
	for (i = 0; i < excludeList.length; i++) {
	
		document.getElementById(excludeList[i]).parentElement.style.display = "none";
	
	}
	
}

function squareShow(num, id) {
	
	var Connect = new XMLHttpRequest();
	Connect.open("GET", "squares.xml", false);
	Connect.setRequestHeader("Content-Type", "text/xml");
	Connect.send(null);

	var response = Connect.responseXML;
	var squares = response.childNodes[0];
	
	sqTitle = firstToString(squares.children[id], "title");
	sqText = firstToString(squares.children[id], "text");
	sqTags = squares.children[id].getElementsByTagName("tag");
	
	immuneTable = document.getElementsByName("immuneTable");
	excludeList = "";
	for (i = 0; i < immuneTable.length; i++) {
		if (immuneTable[i].checked) {
			if (excludeList == "") { excludeList = immuneTable[i].value; }
			else { excludeList = immuneTable[i].value + "," + excludeList; }
		}
	}
	
	sqImmune = "";
	
	if (isAnyTagInList(sqTags, excludeList)) { sqImmune = "<br><i>Vos immunités vous protègent contre les effets de cette case.</i>"; }
	
	document.getElementById("squareDesc").innerHTML = "<b>" + num + " : " + sqTitle + "</b><br><br>" + sqText + "<br>" + sqImmune;
	
}

function isAnyTagInList(tags, list) {
	
	if (list == ""){
		return false;
	}
	
	for (t = 0; t < tags.length; t++) {
		if (list.split(',').includes(tags[t].textContent.toString())){
			return true;
		}
	}
	
	return false;
	
}

function setInfiniteTime() {  
  
	if (document.getElementById("timeUnit").value == "inf") {
		
		document.getElementById("timeNum").value = 0;
		document.getElementById("timeNum").hidden = true;
		
	} else {
		
		document.getElementById("timeNum").hidden = false;
		
	}
	
}

function firstToString(element, tag){
	
	return element.getElementsByTagName(tag)[0].innerHTML.toString();
	
}

function unitToString(unit, num){
	
	plur = "s";
	if (num == 1) { plur = ""; }
	
	switch (unit) {
	
	case "h":
		return "heure" + plur;
		break;
	
	case "j":
		return "jour" + plur;
		break;
	
	case "sem":
		return "semaine" + plur;
		break;
		
	}
	
}

function displayRwdCount(cost, unit){
	
	if (cost != "0") {
		
		immuneTable = document.getElementsByName("immuneTable");
		immuneCount = 0;
	
		for (i = 0; i < immuneTable.length; i++) {
			if (!immuneTable[i].checked) {
				immuneCount++;
			}
		}
		
		rwdCount = Math.floor(immuneCount / parseFloat(cost));
	
		document.getElementById("rwdCount").innerHTML = "<i>Récompense en cas de victoire : " + rwdCount + " " + unit + "</i><br><br>";
	
	}
	
}

function replaceMult(match, p1, shift, str) {
  return parseFloat(p1) * 10 + "cm";
}