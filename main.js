// ------ global settings ------ 

	var ticGlob = {};
	ticGlob.log = false;
	// board settings
	ticGlob.boardSize = 3;
	ticGlob.gridSpaceHeight;
	ticGlob.clickable = true; // this determines whether user can click on board
	ticGlob.turnsTaken = 0;
	// player settings
	ticGlob.player2IsComp = true; // determines whether you play AI or another player
	ticGlob.difficulty = "easy"; // determines difficulty of AI 
	ticGlob.player1 = {"chosen" : []};
	ticGlob.player1.counters = {};
	ticGlob.player1.score=0;
	ticGlob.player2 = {"chosen" : []};
	ticGlob.player2.counters = {};
	ticGlob.player2.score=0;

	ticGlob.currPlayer = "player1";
	

// ------ dev functions ------

// custom console.log function
function cnsl(msg, type, bypass, stringify){ 
	type = type || "norm";
		bgc = "White";
		switch (type) {
			case "norm": 	 color = "black";      bgc = "white";  		    break;
        case "success":  color = "Green";      bgc = "LimeGreen";       break;
        case "info":     color = "DodgerBlue"; bgc = "Turquoise";       break;
        case "error":    color = "Red";        bgc = "Black";           break;
        case "start":    color = "orange";     bgc = "black"; break;
        case "warning":  color = "Tomato";     bgc = "Black";           break;
        case "end":     color = "black";  	bgc = "orange";      	 break;  
        default: color = "black";
    }
	if(!bypass){// if bypass isn't passed to function
		if(ticGlob.log){			
			if(typeof stringify === 'number'){
				console.log("%c" +  JSON.stringify(msg,null,stringify), "color:" + color + ";font-weight:bold; background-color: " + bgc + ";"); // stringify represents the line length
			}else{
				console.log("%c" + msg, "color:" + color + ";font-weight:bold; background-color: " + bgc + ";");
			}
		}
	}else{
		console.log("%c" + msg, "color:" + color + ";font-weight:bold; background-color: " + bgc + ";");
	}
}
// shortcut to JSON.stringify
function strify(elem){
	return JSON.stringify(elem,null,0);
}

// return random integar between two numbers
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


$('document').ready(function(){

	// ------ create board and initial gamestate ------ 
	createBoard(ticGlob.boardSize);
	ticGlob.avail = createAvailSpaces();
	createCounters();

	function createBoard(size){
		var sides = ["grid-top","grid-left","grid-right","grid-bottom"];
		currSide =0;
		for(var i = 0; i < ticGlob.boardSize*ticGlob.boardSize; i++ ){			
			/*apply a class for the sides of the board*/
			var extraClass = "";
			if((i+1)%2===0 ){ // if multiple of 2 (every side)
				extraClass = sides[currSide];
				currSide ++;
			}
			/*apply class for corner */
			if(i===0){ extraClass= "grid-corner_tleft" };
			if(i=== (size-1)){ 	extraClass= "grid-corner_tright" 	}
			if( i===((size*size)-(size) )){ extraClass= "grid-corner_bleft" }
			if(i===((size*size)-1)){ extraClass= "grid-corner_bright" }

			/* append the grid with each gridspace */
			var html = 	'<div class="grid-space ' + extraClass +  '"' + 
						'id=grid-space-' + (i+1) + '>' +
						'</div>';
				$('#grid').append(html);
		}
		
		var gridHeight = (100 / ticGlob.boardSize).toFixed(1);
		$('.grid-space').css({"height":gridHeight+ "%" , "width":gridHeight + "%"});


		var gridSpace = document.getElementById("grid-space-1");
		var pixHeight = gridSpace.offsetHeight;
		ticGlob.gridSpaceHeight = pixHeight;
		$('.grid-space').css({"line-height":pixHeight + "px"});
	}// end of createBoard()
	
	// create available spaces according to the board size
	function createAvailSpaces(){
		var avail = [];
		var id = 0;
		for(var i = 0; i<ticGlob.boardSize; i++){
			for(var j = 0; j<ticGlob.boardSize; j++){
				avail.push([i+1,j+1,id]);
				id++
			}
		}
		return avail;
	}

	// create empty counters for each available space for each player
    function createCounters(){
    	var gridSize = ticGlob.boardSize;
    	
       	pushCountersToPlayer(ticGlob.player1.counters);
    	pushCountersToPlayer(ticGlob.player2.counters);
    	// this creates an array with the number of the row / coll as the first value and the number of selected squares in that section as second val
    	function pushCountersToPlayer(player){
	    	// create rows and colls
	    	var rows = [];
    		var colls = [];
    		var diags = [];
    		// the first variable is the number of the row or coll and the second value is how many are found (the increment val)
	    	for(var i = 1; i<=gridSize; i++){
	    		rows.push([i,0]);
	    		colls.push([i,0]);
	       	}
	       // creates diags (first is for normal diag second for anti-diag)
	       	diags.push([1,0]);
	       	diags.push([2,0]);
	       	player.rows=rows;
	       	player.colls=colls;
	       	player.diags=diags;
    	}
    }// create Counters
	
    // check if selection is available in ticGlob.avail
	function searchById(id){
		id --;  // for use with index
		for(var i = 0; i<ticGlob.avail.length; i++){
			if(ticGlob.avail[i][2] === id){ // found id
				var found = ticGlob.avail[i]; // array that matches id	
				return found;
			}
		}
	}//

	// if grid-space is clicked process the choice
	$('.grid-space').click(function(){
		cnsl("gridsoace clicked!");
		if(ticGlob.clickable){
			cnsl("you can click");
			var id = parseInt(this.id[this.id.length-1],10);
			processChoice(id);		
		}else{
			cnsl("you can't click");
		}
	})

	// reset players.chosen and board stats
	$('#reset-button').click(function(){
		resetBoard();

		ticGlob.player1.score=0;
		ticGlob.player2.score=0;

		var statsHtml = '<div id="player-1-stat">player 1: <div id="player-1-score">0</div></div>'+ 
						'<div id="player-2-stat">player 2: <div id="player-2-score">0</div> </div>'
		$('#player-stats').html(statsHtml);
	})

	// ------ difficulty buttons ------
	$('#d-easy').click(function(){
		var elem = this.id;
		removeHighlight();
		ticGlob.difficulty = "easy";
		$('#'+elem).css({"color": "blue"});
	})
	$('#d-hard').click(function(){
		var elem = this.id;
		removeHighlight();
		ticGlob.difficulty = "hard";
		$('#'+elem).css({"color": "blue"});
	})
	$('#d-impossible').click(function(){
		var elem = this.id;
		removeHighlight();
		ticGlob.difficulty = "impossible";
		$('#'+elem).css({"color": "blue"});
	})
	
	// remove selection highlight on other difficulties
	function removeHighlight(){
		for (var i =0; i<3; i++){
			 $("#d-easy , #d-hard , #d-impossible").css({"color": "black","font-weight":"none"});
		}
	}
	
	// the core function of the project determining the outcome of a player's selection
	function processChoice(id){					
			var elem = "grid-space-" + id;
			var found = searchById(id);
			if(found){ // if found 
						// need to remove the selected space from avail
						var index = ticGlob.avail.indexOf(found);
						ticGlob.avail.splice(index, 1); // delete 1 at the found index.

						//push the selected to the players chosen array
						var currPlayersChosen = ticGlob[ticGlob.currPlayer]["chosen"];

						var foundArr = [];
						for(var j=0; j<found.length; j++){
							foundArr.push(found[j]);
						} 
						currPlayersChosen.push(  foundArr );

						// add a marker to board currosponding to current player (X or O)
						addMarker(elem);

						// increment the score
						var incrementResult = incrementCounters(found,ticGlob);
						ticGlob.turnsTaken++;
						cnsl("turnTaken: " + ticGlob.turnsTaken);
						$('#turns-taken').html(ticGlob.turnsTaken);
						
						// check to see if it's a winning result					
						 if(incrementResult[0]==="win"){
						 	 toggleClickable(false);

						 	 addWinLine(incrementResult[1],incrementResult[2]); 
						 	 displayWin();
			    			 		
							 resetBoard(1,true);			 	 	
						 }else{ // not a win
							if(ticGlob.avail.length===0){ // that was the last space
								resetBoard(1); // this is ok
							}else{// no win or draw
							 	changePlayer(true);
							} 	
						 }
			}else{
				cnsl("selected space is not available");
			}
	}//processChoice

	function toggleClickable(bool){
		ticGlob.clickable = bool;
	}
	// add market to board (X or 0)
	function addMarker(elem){
		elem = $('#' + elem);
		// switch curr player
		if(ticGlob.currPlayer==="player1"){
						elem.addClass( "naughts" );
						markerFx("X");
					
		}
		if(ticGlob.currPlayer==="player2"){	
						elem.addClass( "crosses" );
						markerFx("O");
		}
		// animate marker when it is intiially added
		function markerFx(text){
			
			elem.html(text);
			elem.originalSize = elem.css( "font-size" );
			var convertSize =  parseInt(elem.originalSize.substring(0, elem.originalSize.length - 2),10);

			elem.animate({
			    "font-size": ((convertSize * 1.2) + "px")
			  }, 
			  20, 
			  'swing', //'easeOutBounce'
			  function() {
			    // Animation complete.
			    elem.animate({
				    "font-size": elem.originalSize
				  }, 100)
			});
		}
	}

	function changePlayer(runAi){
		// if comp is set to true run compAI automatically
		var curr = ticGlob.currPlayer;
		if(curr==="player1"){
			ticGlob.currPlayer="player2";
		}
		if(curr==="player2"){
			ticGlob.currPlayer="player1";
		}
		if(runAi){
			if(ticGlob.player2IsComp && ticGlob.currPlayer==="player2"){
				 runAiTurn(); 
			}
		}	
	}

	// see if grid selection is in a space that can potentially contribute to a diag
    function checkDiag(entry){
    
    	var rowIndex = entry[0];
    	var collIndex = entry[1];
	    if(rowIndex ===collIndex){
		return true;
		}else{
		return false;
		}
    }
	// see if grid selection is in a space that can potentially conttribute to an anti-diag
 	function checkAntiDiag(entry){
		var antiDiag= false;
		var rowIndex = entry[0];
    	var collIndex = entry[1];
		var boardSize = ticGlob.boardSize;
			// the difference between the first value and the board size needs to be the same as the difference between 1 and the second value
			var diffFirst = boardSize-entry[0];
			var diffSecond = entry[1] - 1;
			if(diffFirst === diffSecond){
				cnsl("--- matches anti diag ----");
				return true;
			}else{
				cnsl("--- not match anti diag---");
				return false;
			}
	}

    // this function adds a counter for the respective row and coll when the user selects a box
    function incrementCounters(newEntry){
    	//ticGlob.log=false;
    	var currPlayer = ticGlob.currPlayer;
    	var chosen = ticGlob[currPlayer]["chosen"][0];

    	var newIncrements = [];
	
    	var rowIndex = newEntry[0];
    	var collIndex = newEntry[1];
    	
    	var diag = checkDiag(newEntry);
    	var antiDiag = checkAntiDiag(newEntry);

	    /* increment the counter for each respective row, coll, diag, antidiag */
    	ticGlob[currPlayer]["counters"]["rows"][rowIndex-1][1] ++;
    	  var newRow = ticGlob[currPlayer]["counters"]["rows"][rowIndex-1];
    	ticGlob[currPlayer]["counters"]["colls"][collIndex-1][1] ++;
    	  var newColl = ticGlob[currPlayer]["counters"]["colls"][collIndex-1];
    	
    	var newDiag, newAntiDiag;
    	if(diag){ 
    		ticGlob[currPlayer]["counters"]["diags"][0][1] ++; 
    		newDiag = ticGlob[currPlayer]["counters"]["diags"][0];
    	}

    	if(antiDiag){ 
    		ticGlob[currPlayer]["counters"]["diags"][1][1] ++; 
    		newAntiDiag = ticGlob[currPlayer]["counters"]["diags"][1];
    	}
    	
    	var winResult = checkForWin(newRow,newColl, newDiag, newAntiDiag);

    	if(winResult[0]){ // if its true go for it
    		 cnsl(" its a win! at " + winResult[1] + " " + winResult[2] + " for player : " + ticGlob.currPlayer, "success");
    		 return ["win",winResult[1],winResult[2]];
    	
    	}else{
    		return ["noWin"];
    		cnsl("--- still not won---");
    	}
    }// end of increment counters

    function checkForWin(rows,colls,diag, antiDiag){
    	if(rows[1] ===3){
    		cnsl("3 in a row in row - " + rows[0]);
    		return [true,"row",rows[0]];
    	}
    	if(colls[1] ===3){
    		cnsl("3 in a row in coll - " + colls[0]);
    		return [true,"colls",colls[0]];
    	}
	   if(diag){ // if diag exists
	    	if(diag[1] ===3){
	    		cnsl("3 in a row in diag - " + diag[1]);
	    		return [true,"diag"];
	    	}
	    }
	    if(antiDiag){ // if antiDiag exists
	    	if(antiDiag[1] ===3){
	    		cnsl("3 in a row in antiDiag - " + antiDiag[0]);
	    		return [true,"antiDiag"];
	    	}
	    }

    	return [false];
    }
    
  

    // ------ function for positioning and placing the line for when a player wins 
    function addWinLine(lineType, number){
    	
    	var gridHeight, gridSpace;

    		// need find the number at the start of the row
	    	function customFloor(value, roundTo) {
	    		if(value % roundTo === 0){ // if not already divisble you can round down
			    	value--;
			    	return ((Math.floor(value / roundTo) * roundTo) + 1 );
				}else{
					cnsl("remainder not 0");
					return ((Math.floor(value / roundTo) * roundTo) + 1 );
				}
			}
    	
    	// positioning the line 
    	switch(lineType) {
    		case "diag":
    			gridSpace = "#grid-space-1";
    			break;
    		case "antiDiag":
    			gridSpace = "#grid-space-" + ticGlob.boardSize;
    			break;
    		case "colls":
    			
    			gridSpace = "#grid-space-" + number;
    			break;
    		case "row":
    			gridSpace = "#grid-space-" + customFloor(ticGlob.boardSize*number,3); // 
    			break;
    	}

    	$( gridSpace ).append( '<div id="winLine"></div>' );
    	var line = $('#winLine');
    	
    	// style the line appropriately 
    	switch(lineType) {
		    case "diag":
		        gridHeight = (ticGlob.gridSpaceHeight*3.5);
	    		line.css({"top": "25%" });
	  			line.css({"left" : "25%" });
	    		line.css({"height": gridHeight });
	    			line.removeClass();
	           		line.addClass("rotateDiag");
		        break;
		    case "antiDiag":
		        gridHeight = (ticGlob.gridSpaceHeight*3.5);
	  			line.css({"top": "25%" });
	  			line.css({"left" : "75%" });
	       		line.css({"height": gridHeight });
	    			line.removeClass();
	           		line.addClass("rotateAntiDiag");
		        break;
		    case "colls":
		    	gridHeight = (ticGlob.gridSpaceHeight*3)- (ticGlob.gridSpaceHeight / 2);
		    	line.css({"top": ticGlob.gridSpaceHeight / 4});
		    	line.css({"height": gridHeight });
		    		line.removeClass();
		    	break;
		    case "row":
		    	gridHeight = (ticGlob.gridSpaceHeight*3) - (ticGlob.gridSpaceHeight / 2);
		    	line.css({"top": "55%"});
		    	line.css({"left": ( ticGlob.gridSpaceHeight / 4 ) });
		    	line.css({"height": gridHeight });
		    		line.removeClass();
	           		line.addClass("rotateHorizontal");
		    	break;
		    default:
		        break;
		}

    	cnsl(gridHeight);  
    }
    /*   - update the stats and display the win -   */

	function displayWin(){
		incrementScore();
		function incrementScore(){
				ticGlob[ticGlob.currPlayer]["score"]++;
					if(ticGlob.currPlayer==="player1"){
						$('#player-1-score').html(ticGlob[ticGlob.currPlayer]["score"]);
					}
					if(ticGlob.currPlayer==="player2"){
						$('#player-2-score').html(ticGlob[ticGlob.currPlayer]["score"]);
					}
		}

		// if the scores are different change the order the player stats are displayed
		if(ticGlob.player1.score  !== ticGlob.player2.score ){
			arrangeScores();
			/*   - find the highest score and arrange them accordingly (heighest top- lowest bottom) -   */
			function arrangeScores(){
				var player = ticGlob.player1.score > ticGlob.player2.score ? "player-1" : "player-2";
				var playerDiv = '#' + player + '-stat';
				var content = $(playerDiv).html();
				var parent = $(playerDiv).parent();

				var htmlOuter= '<div id= "'+ player +'-stat">' +content+'</div>';
				 $(playerDiv).remove();
				 parent.prepend( htmlOuter );
			}
		}
	}//---displayerWin() 
	

	function runAiTurn(){
		
		// for choosing a random space on the board (also used for 'easy' difficulty)
		function randomChoice(arr){
			var rand = getRandomInt(0,arr.length-1);
			var selected = arr[rand];
			return selected;
		}
		
		// brute force AI implementation (normal AI settings)
		/* if (the comp can take a space that will allow it to win it will)
		   else (if not it will look to block the other player from winning)
		   if neither of the above are possible it will just choose randomly */
		function calculatedChoice(){
		
			
			var canWinResult = canWin();

			if(typeof canWinResult ==="number"){ //  (canWin only returns the id if there is a win)
				return canWinResult;
			}
			var blockPlayerResult = blockPlayer();
			if(typeof blockPlayerResult==='number'){
				return blockPlayerResult;
			}
			
			// if this far it can't find a good option (just return random)
			return randomChoice(ticGlob.avail)[2];

			function canWin(){
				
				var counters = ticGlob[ticGlob.currPlayer]["counters"];
				var result = searchForAlmostWon();

				if(typeof result ==="number"){// if the id is returned and val isn't falsey
					return result; // this returns the ID;
				}else{
					cnsl("no id to be found in can win","fail");
				}

				// search for any values that are 1 less than the boardSize and then calls to a function to checkAvail
				function searchForAlmostWon(){
					for(var key in counters){
						for(var i=0; i<counters[key].length; i++){
							if(counters[key][i][1]===(ticGlob.boardSize - 1)){
								var id;
								var foundId = findIfAvail(key,counters[key][i][0]);
								if(typeof foundId==='number'){ // if this is not undefined it means a result was returned!
									return foundId; 
								}
							}
						}
					}
					return false; // if this far return an undefined val
				}


				function findIfAvail(type,num){
					cnsl(ticGlob.avail,false,false,0);
					var lookFor;
					var result;
						if(type === "colls"){
							lookFor = 1 ;// number 1 is the second part of array (representing the coll)
							result = checkRowOrColl(lookFor);
							if(typeof result ==='number'){
								return result;
							}
						}
						if(type==="rows"){
							lookFor = 0 ;// number 0 look for first entry
							result = checkRowOrColl(lookFor);
							if(typeof result ==='number'){
								return result;
							}
						}
						if(type==="diags"){
							if(num===1){
								var diagFound = lookForDiag("diag");
								if(typeof diagFound ==='number'){
									return diagFound;
								}
							}
							if(num===2){
								//antiDiag
								var antiDiagFound = lookForDiag("antiDiag"); 
								if(typeof antiDiagFound ==='number'){
									return antiDiagFound;
								}
							}
						}

					function checkRowOrColl(posInArray){
						for (var i = 0; i<ticGlob.avail.length; i++){
							//console.log(ticGlob.avail[i]);
							if(ticGlob.avail[i][posInArray]===num){
								cnsl("found a match that can make the win!!!" + ticGlob.avail[i]);
								return ticGlob.avail[i][2]; // return id
							}
						}
						return false;
					}
					function lookForDiag(type){
						cnsl("---lookForDiag()----");	
						var isDiag;

							for (var i = 0; i<ticGlob.avail.length; i++){
								
								if(type==="diag"){isDiag=checkDiag(ticGlob.avail[i]);}
								if(type==="antiDiag"){isDiag=checkAntiDiag(ticGlob.avail[i]);}
								
								if (isDiag){
									cnsl("found a " + type);
									return ticGlob.avail[i][2]; //return id
								}	
							}
							return false;
					}//lookForDiag				
					return false; // if this far then no match was found
				}
			}// --  canWin()
			// check to see if the player can potentially win on the next turn by simulating their turn using the same functions above
			function blockPlayer(){
				cnsl("---blockPlayer()---", "start");
				changePlayer(false); // change player but don't run Ai
				var result = canWin();
				changePlayer(false); 
				if(typeof result === 'number'){
					cnsl("found something to block! - result :  " + result);		
					return result;
				}	
				cnsl("---blockPlayer()---", "end");
			}

		}// --- calculatedchoice()

		// advanced AI using an custom and optimised implementation of the Minimax algorithim
		/* this algo recursively iterrates through every possible board space selection and returns a value according to how good of a choice it is
		it does this by checking the potential for the AI player at each node to win and the potential for the opposing player to also win
		negative values are passed if it's the opposing player */
		function miniMax(depth, player){
			var opponent = player === "player1" ? "player2" : "player1";

			var availOrig = JSON.parse(JSON.stringify(ticGlob.avail));
			//	make array to save the choices made at each node
			var choicesIndex = [];
			// use depth as a fallback base case for the recursion
			depth = 5;
			var depthOrigin = depth;

			var miniMaxResult = miniMax_r(depth,availOrig);
			var choiceIndex;
		
			function miniMax_r(depth,avail){

					var val;
					var newVal;
					var valArr =[];
					var choiceArr=[];	
					
					var availReset = JSON.parse(JSON.stringify(avail));
					var playerOrig = JSON.parse(JSON.stringify(ticGlob[player]));
					var opponentOrig = JSON.parse(JSON.stringify(ticGlob[opponent]));
										
					/* BASE CASE */
					if(depth===0){
						return "depth hit"; 
					}
	
					// simulated the adding and removal of values from ticGlob.avail and ticGLob.counters
					function simChoice(choice){
								var index = avail.indexOf(choice);	
								//push the selected to the players chosen array
								var currPlayersChosen = ticGlob[ticGlob.currPlayer]["chosen"];
								currPlayersChosen.push(choice);
							
								avail.splice(index, 1); // delete 1 at the found index.
		
								if(choice){// if choice is available			
									var winResult = incrementCounters(choice); // this function check for win and incrememnts counters for current player
									return winResult; // this return win or lose
								}
					}
					//createMmValue() prvides value -1 for lose 0 for draw and 1 for win
					function createMmValue(result){ 
							var val;
							if(result[0]==="win"){ 
								val =  1*depth;
							}else{
								val = 0;
							}
							if(ticGlob.currPlayer === opponent){	
								val = -val;
							}
							return val;
					} 
					
					function resetSettings(){
							ticGlob.currPlayer  = ticGlob.currPlayer  === "player1" ? "player2" : "player1";
							ticGlob[player] = JSON.parse(JSON.stringify(playerOrig));
							ticGlob[opponent] = JSON.parse(JSON.stringify(opponentOrig));
							avail = JSON.parse(JSON.stringify(availReset));	
					}
					
					// optimisation -> if it's the first choice of the board select the center square (saves a lot of computation time for the same choice it would make anyway)
					if(avail.length === (ticGlob.boardSize*3) || avail.length === ((ticGlob.boardSize*3)-1) ){
						var choice;
						/* always choose center square first if available */
						function centerSquare(){
							for (var i = 0;  i<avail.length; i++){
								if(avail[i][2]===4){
									return avail[i]; // found center square
								}
							}
							return false; // return false if not found
						}
						var cntrSquare = centerSquare();
						if(cntrSquare){// check is center square is available
							choice = cntrSquare;
						}else{
							choice = randomChoice(avail);
						}
						choiceIndex = choice[2];				
						simChoice(choice);				
					}else{ // if not the first choice on the board		
						
						// for all available options on the board
						for(var i =0; i<avail.length; i++){

							var choice = avail[i];	
							var currIndex = avail[i][2];
								
							var winResult = simChoice(avail[i]);
				
							// make negative if currplayer is opposition and * by depth
							var val = createMmValue(winResult); 

							if(val !== 0){ // if win
								// will not recurse deeper into the tree if a win is found because the algo assumes each player will always make the best choice
										cnsl("got win at i : " + i + " val : " + val + " will not recurse as it's not necessary ");
										valArr.push(val); // depth has already been applies
										choiceArr.push(choice);											
							}else{ // its a draw so look into what the other player will do next turn
								ticGlob.currPlayer  = ticGlob.currPlayer  === "player1" ? "player2" : "player1";
								/* RECURSE!!!!! */
								var newVal =  miniMax_r(depth-1, avail );

								// if the recurse result is a number it means it didn't return the base case 'depth hit'
								if(typeof newVal === 'number'){ 
										valArr.push(newVal);
										choiceArr.push(choice);
									
								}else{
									cnsl("base case hit");
								}			
							
								// reset settings after recrusion 
								resetSettings();				
							}					
						}// END OF FOR LOOP 
					}// end of else // not the the first move

					
					
					/* -----------------CHOOSE THE VALUE TO RETURN  ----------------------*/

					var chosenVal;
			
					if(choiceArr.length !== 0){	 	
						if(ticGlob.currPlayer===player){
								//look for max val in array
								chosenVal = valArr[indexOfMax(valArr)] ;
								choiceIndex = choiceArr[ indexOfMinOrMax(valArr, "max") ][2]; // UPDATE GLOBAL CHOICE INDEX
						}else{// === opponent					
								// look for min val in array
								chosenVal = valArr[indexOfMin(valArr)] ; 
								choiceIndex = choiceArr[ indexOfMinOrMax(valArr, "min") ][2]; // UPDATE GLOBAL CHOICE INDEX
						}	
						cnsl("chosenVal: " + chosenVal);
					}

					// check to see if a value is returned
					if (typeof chosenVal ==='number'){
						return chosenVal;
					}else{
						// it makes no difference which choice is made so just choose 0
						return 0;
					}
					
			}// miniMax_r()
					
					/* simple functions returning the index of the max or min array respectively */
					function indexOfMax(arr) {// would be nice the max values in the arr and randomly return one (not just the first max val)
							   
							    var max = arr[0];
							    var indexArr=[];
							    var maxArr=[];
							    for (var i = 0; i < arr.length; i++) {
							        if (arr[i] > max) {        	// if current is bigger than max create new maxArr
	
							        	max = arr[i]; 
							        	
							        	maxArr=[]; // empty maxArr
							        	indexArr=[];

							        	maxArr.push(arr[i]);
							         	indexArr.push(i);
							        }else if( arr[i]===max){   	// same as max so add to maxArr
							        	maxArr.push(arr[i]);
							         	indexArr.push(i);
							        }
							    }

							    var randomNum =getRandomInt(0,indexArr.length-1);

							    return indexArr[randomNum]; // this needs to retunr an index number from the original arr		      
					}
					function indexOfMin(arr) {
							    var min = arr[0];
							    var minIndex = 0;
							    for (var i = 1; i < arr.length; i++) {
							        if (arr[i] < min) {
							            minIndex = i;
							            min = arr[i];
							        }
							    }
							    return minIndex;				
					}
					
					/* this groups all of the max / min in an array and randomly returns one*/
					function indexOfMinOrMax(arr,  minOrMax ){
								
							 var indexArr=[];
							 var extremumArr=[];

							 var extremum = arr[0];
	
							 	if(minOrMax==="max"){
							 		   for (var i = 0; i < arr.length; i++) {
									        if (   arr[i] > extremum ) {     
									       
									        	extremum = arr[i]; // new extremum 
									 
									        	extreumumArr=[]; 
									        	indexArr=[];

									        	extreumumArr.push(arr[i]);
									         	indexArr.push(i);
										     }else if( arr[i]===extremum){   	// same as max so add to maxArr
										        	extremumArr.push(arr[i]);
										         	indexArr.push(i);
										     }
										     cnsl("maxArr now : " + extremumArr);
										 }

							 	}else{ //minOrmAX ==="min"
				
							 			 for (var i = 0; i < arr.length; i++) {
									        if (arr[i] < extremum) {     // if current is bigger than max create new maxArr
									     
									        	extremum = arr[i]; 
									        	
									        	extremumArr=[]; // empty maxArr
									        	indexArr=[];

									        	extremumArr.push(arr[i]);
									         	indexArr.push(i);

										        }else if( arr[i]===extremum){   	// same as max so add to maxArr
										     		cnsl("arr[i]: " +arr[i]+ " ===extremum " + extremum );
										        	extremumArr.push(arr[i]);
										         	indexArr.push(i);
										        }
										 }
							 	}

							    var randomNum =getRandomInt(0,indexArr.length-1);	   							   
							    return indexArr[randomNum]; // this needs to retunr an index number from the original arr
						}// end of indexOfMinOrMax function


		
			cnsl("---miniMax()---","end");
			return choiceIndex;
		}// miniMax()

		var gridSpaceId;
		var aiChoice;

		// run AI according to the difficulty
		switch(ticGlob.difficulty) {
		    case "easy": 
		        cnsl("in easy");
		        aiChoice =  randomChoice(ticGlob.avail)[2] + 1;
		        break;
		    case "hard":
		         cnsl("in hard");
		         aiChoice = calculatedChoice() +1;
		        break;
		    case "impossible":
		    	 cnsl("in impossible");
		    	 var originalTicGlob = JSON.parse(JSON.stringify(ticGlob));  // copy all settings for later use
		         aiChoice = miniMax(3, ticGlob.currPlayer)+1;
		         ticGlob = originalTicGlob;
		}


		processChoice(aiChoice);
	}// ---runAiTurn()

	// reset board to the default state 
	function resetBoard(delay,win){

		toggleClickable(false);	

		if(delay){
			delay = delay*1000;
		}else{
			delay = 0;
		}
			
		setTimeout(function(){ 

			ticGlob.turnsTaken = 0;
			$('#turns-taken').html(ticGlob.turnsTaken);

			// remove all HTML from grid-space
			for(var i = 1; i <= ticGlob.boardSize*ticGlob.boardSize; i++ ){			
				var currGridSpace = "#grid-space-" + i;
				$(currGridSpace).html("");
				$(currGridSpace).removeClass("naughts crosses");
			}

			// reset available spaces
			ticGlob.avail = [];
			ticGlob.avail = createAvailSpaces();

			// reset the counters
			ticGlob.player1.chosen = [];
			ticGlob.player1.counters = {};
			ticGlob.player2.chosen = [];
			ticGlob.player2.counters = {};
			createCounters();

						
			toggleClickable(true);

			cnsl("win! " + win);
			if(!win){ // have the same player start next turn if they win
				cnsl("it's not a win");
				changePlayer(true);
			}	
			// if computer is player 2 run the turn as AI
			 cnsl("curr player before reset: " + ticGlob.currPlayer);
			if(ticGlob.player2IsComp && ticGlob.currPlayer==="player2"){
				 //disable clicking
				runAiTurn();
				//toggleClickable(true); // enable clicking
			}
		}, delay);
	}// ---resetBoard()

}); //end of document.ready()

	
