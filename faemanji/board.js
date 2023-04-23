
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
	
	return element.getElementsByTagName(tag)[0].textContent.toString();
	
}