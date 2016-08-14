
$('document').ready(function(){
		 
		
	// create global settings
	var ticGlob = {};
	ticGlob.log = false;
	ticGlob.boardSize = 3;
	ticGlob.player1 = {"chosen" : []};
	ticGlob.player1.counters = {};
	ticGlob.player1.score=0;
	ticGlob.player2 = {"chosen" : []};
	ticGlob.player2.counters = {};
	ticGlob.player2.score=0;
	//console.log(JSON.stringify(ticGlob.player1,null,0));
	ticGlob.turnsTaken = 0;
	ticGlob.currPlayer = "player1";
	ticGlob.gridSpaceHeight;

	ticGlob.clickable = true; // this determines whether user can click on board

	ticGlob.player2IsComp = true;

	ticGlob.difficulty = "easy";
	//

	//console.log(JSON.stringify(ticGlob, null , 1));

	/* setup board */

	createBoard(ticGlob.boardSize);
	ticGlob.avail = createAvailSpaces();
	createCounters();

	


	// log is the message - bypass is boolean - stringify is a num
	function cnsl(msg, type, bypass, stringify){ // function for running the console.log
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
	function strify(elem){
		return JSON.stringify(elem,null,0);
	}
	function getRandomInt(min, max) {
			    return Math.floor(Math.random() * (max - min + 1)) + min;
			}

	function createBoard(size){
		cnsl("---createBoard()---");
		
		
		var sides = ["grid-top","grid-left","grid-right","grid-bottom"];
		currSide =0;

		for(var i = 0; i < ticGlob.boardSize*ticGlob.boardSize; i++ ){			
			
			/*apply a class for the sides */
			var extraClass = "";
			if((i+1)%2===0 ){ // if multiple of 2 (every side)
				extraClass = sides[currSide];
				currSide ++;
				console.log("i: " + i+  " mod 3 = 0 and currSlide just incrememnted to  "+ +currSide);
			}
			/*apply class for corner */
			if(i===0){ extraClass= "grid-corner_tleft" };
			if(i=== (size-1)){ 	extraClass= "grid-corner_tright" 	}
			if( i===((size*size)-(size) )){ extraClass= "grid-corner_bleft" }
			if(i===((size*size)-1)){ extraClass= "grid-corner_bright" }

			//if edge div then apply on 2 side

			/* append the grid which each gridspace */
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
	
	//this function creates Avail spaces
	function createAvailSpaces(){
		var avail = [];
		var id = 0;
		for(var i = 0; i<ticGlob.boardSize; i++){
			// i represents a row
			for(var j = 0; j<ticGlob.boardSize; j++){
				avail.push([i+1,j+1,id]);
				id++
			}

		}
		return avail;
	}

    function createCounters(){
    	cnsl("---createCounters()---");
    	var gridSize = ticGlob.boardSize;
    	
       	pushCountersToPlayer(ticGlob.player1.counters);
    	pushCountersToPlayer(ticGlob.player2.counters);
    	// this creates an array with the number of the row / coll as the first value and the number of selected squares in that section as second val
    	function pushCountersToPlayer(player){
	    	// this creates rows and colls
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
    	}//
    }// create Counters
	

	function searchById(id){
		cnsl("---searchById()--- id: " + id);
		id --;  // for use with index
		cnsl(JSON.stringify("ticGlob.avail : " + ticGlob.avail, null , 0));
		// can either run a for loop for every val (time consuming) or do some sort of index of 
			// indexOf difficult because the array is nestes (maybe for loop cannot be avoided)
		for(var i = 0; i<ticGlob.avail.length; i++){
			if(ticGlob.avail[i][2] === id){ // found id
				var found = ticGlob.avail[i]; // array that matches id	
				
				return found;
			}
		}
	}//


		 // get last char from id (this is the number)
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

	$('#reset-button').click(function(){
		resetBoard();
	
		// reset the score
		ticGlob.player1.score=0;
		ticGlob.player2.score=0;

		var statsHtml = '<div id="player-1-stat">player 1: <div id="player-1-score">0</div></div>'+ 
						'<div id="player-2-stat">player 2: <div id="player-2-score">0</div> </div>'
		$('#player-stats').html(statsHtml);

	})


	$('#d-easy').click(function(){
		//var elem = $(this).attr("class");
		var elem = this.id;
		cnsl("elem : " + elem);
		removeHighlight();
		ticGlob.difficulty = "easy";
		$('#'+elem).css({"color": "blue"});

		cnsl(ticGlob.difficulty);
	})
	$('#d-hard').click(function(){
		var elem = this.id;
		cnsl("elem : " + elem);
		removeHighlight();
		ticGlob.difficulty = "hard";
		$('#'+elem).css({"color": "blue"});

		cnsl(ticGlob.difficulty);
	})
	$('#d-impossible').click(function(){
		var elem = this.id;
		cnsl("elem : " + elem);
		removeHighlight();
		ticGlob.difficulty = "impossible";
		$('#'+elem).css({"color": "blue"});

		cnsl(ticGlob.difficulty);
	})
	/* need to discolour other selections when a new is clicked */

	function removeHighlight(){
		for (var i =0; i<3; i++){
			
			 $("#d-easy , #d-hard , #d-impossible").css({"color": "black","font-weight":"none"});

		}
	}
	
	function processChoice(id){
			//ticGlob.log=false;
			cnsl("------------processChoice()------------ ");

			
					
			var elem = "grid-space-" + id;
			
			// found is the element tha player has clicked on 
			var found = searchById(id);

			if(found){ // if found 

					// need to remove the selected grid from available a
						var index = ticGlob.avail.indexOf(found);
						ticGlob.avail.splice(index, 1); // delete 1 at the found index.

					//push the selected to the players chosen array
					
						var currPlayersChosen = ticGlob[ticGlob.currPlayer]["chosen"];
					

						
						var foundArr = [];
						for(var j=0; j<found.length; j++){
							foundArr.push(found[j]);
						} 
						cnsl("foundArr: "  + foundArr + typeof foundArr);
						currPlayersChosen.push(  foundArr );

						
				
					// add a marker currosponding to current player (X or O)
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
			    			 
						 	  // reset the board and start again with 1 second break
						 	  
						 	  resetBoard(1,true);
						 	  
				    		 
				    		
							

						 }else{
							 	// there is an error here where the AI is able to make a move after player 1 has won
								// only call the AI if clickable is true
							if(ticGlob.avail.length===0){
								resetBoard(1); // this is ok
							}else{// no win or draw
							 	changePlayer(true);
							}
						 	
						 }
						// if draw

						
			    	
					// if it incrememntcounter reutnrs draw you need reset the timer and change player
					// if it return nothing just change player

			}else{
				// do nothing
				cnsl("selected space is not available");
			}
	}//processChoice

	function toggleClickable(bool){

		ticGlob.clickable = bool;
		cnsl("-------------------------toggleCLickable---- " + ticGlob.clickable);
	}
	function addMarker(elem){
		cnsl("---addMarker()---","start");
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

		function markerFx(text){
			
			elem.html(text);
			elem.originalSize = elem.css( "font-size" );
			cnsl("originalSize: " + elem.originalSize + "typeof : " + typeof elem.originalSize);
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
		cnsl("---changePlayer()--- currPlayer: " + ticGlob.currPlayer);
		// if comp is set to true run compAI
		var curr = ticGlob.currPlayer;
		if(curr==="player1"){
			ticGlob.currPlayer="player2";
		}
		if(curr==="player2"){
			ticGlob.currPlayer="player1";
		}
		if(runAi){
			cnsl("runAi is true");
			if(ticGlob.player2IsComp && ticGlob.currPlayer==="player2"){
			 // set timeout to make it seem like robot i sthinking about it.
				var randomTime = Math.floor(Math.random() * 500) + 200  	
				//setTimeout(function(){

				 runAiTurn(); 

				 //}, randomTime);

				}
		}
	
		
	}

	// you need to check to see if there is a diag or antiDiag	
    	
    	
    function checkDiag(entry){
    
    	var rowIndex = entry[0];
    	var collIndex = entry[1];
	    if(rowIndex ===collIndex){
		return true;
		}else{
		return false;
		}
    }
	
 	function checkAntiDiag(entry){
		var antiDiag= false;
		var rowIndex = entry[0];
    	var collIndex = entry[1];
		cnsl("---checkAntiDiag()--- newEntry: " + entry);
		var boardSize = ticGlob.boardSize;
			// the difference between the first value and the board size needs to be the same as the difference between 1 and the second value
			var diffFirst = boardSize-entry[0];
			var diffSecond = entry[1] - 1;
		cnsl("diffFIrst: " + diffFirst + " diffSecond : " + diffSecond);
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
    	cnsl("---incrementCounters()---");
    	//ticGlob.log=false;
    	cnsl(newEntry);

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
    		cnsl("newRows: " + newRow);
    	ticGlob[currPlayer]["counters"]["colls"][collIndex-1][1] ++;
    	  var newColl = ticGlob[currPlayer]["counters"]["colls"][collIndex-1];
    		cnsl("newColl: " + newColl);
    	var newDiag, newAntiDiag;
    	if(diag){ 
    		ticGlob[currPlayer]["counters"]["diags"][0][1] ++; 
    		newDiag = ticGlob[currPlayer]["counters"]["diags"][0];
    	}
    		cnsl("newDiag: " + newDiag);
    	if(antiDiag){ 
    		ticGlob[currPlayer]["counters"]["diags"][1][1] ++; 
    		newAntiDiag = ticGlob[currPlayer]["counters"]["diags"][1];
    	}
    		cnsl("newAntiDiag: " + newAntiDiag);

    
    	cnsl(ticGlob[currPlayer]["counters"],false,false,0);
    	cnsl(ticGlob[currPlayer]["counters"]["rows"],false,false,0);	
    	cnsl(ticGlob[currPlayer]["counters"]["colls"],false,false,0);
    	cnsl(ticGlob[currPlayer]["counters"]["diags"],false,false,0);

    	
    	var winResult = checkForWin(newRow,newColl, newDiag, newAntiDiag);
    	cnsl("winResult: " + winResult);
    	//ticGlob.log = true;

    	if(winResult[0]){ // if its true go for it
    		cnsl("--------------- its a win! at " + winResult[1] + " " + winResult[2] + "------------------- for player : " + ticGlob.currPlayer, "success");
    		 return ["win",winResult[1],winResult[2]];
    	
    	}else{
    		return ["noWin"];
    		cnsl("--- still not won---");
    	}
  		

    	// IF WIN IT NEEDS TO HIGHLIGHT WHERE IT HAS WON

    	

    }// end of increment counters

    function checkForWin(rows,colls,diag, antiDiag){
    	cnsl("---checkForWin()---");
    	cnsl("rows pushed: " + JSON.stringify(rows,null,0));
    	cnsl("colls count: " + JSON.stringify(colls,null,0));
    	cnsl("rows[1]: " + rows[1] + " colls[1]: " + colls[1]);
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

    	cnsl(rows[1] + " in a row in row - " + rows[0]);
    	return [false];
    }
    
  

    /*   - function for positioning and placing the line for when a player wins -   */
    function addWinLine(lineType, number){
    	
    	cnsl("---addWinLine()--- lineType: " + lineType + " number: " + number);
    	var gridHeight, gridSpace;
   
    	// need find the number at the start of the row
	    	function customFloor(value, roundTo) {
	    		if(value % roundTo === 0){ // if not already divisble you can round down
			    
			    	cnsl("remainder iss 0");
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
    	
    	cnsl("gridspace designation : " + gridSpace);
    	
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
		        //default 
		        break;
		}

    	cnsl(gridHeight);  
    }
    /*   - update the stats and display the win -   */

	function displayWin(){
		cnsl("---displayWin()--- currPlayer: " +  ticGlob.currPlayer);
	
		incrementScore();
		
		function incrementScore(){
				ticGlob[ticGlob.currPlayer]["score"]++;
					if(ticGlob.currPlayer==="player1"){
						$('#player-1-score').html(ticGlob[ticGlob.currPlayer]["score"]);
					}
					if(ticGlob.currPlayer==="player2"){
						$('#player-2-score').html(ticGlob[ticGlob.currPlayer]["score"]);
					}
		
			cnsl("newscore: " + ticGlob[ticGlob.currPlayer]["score"] );
		}

		// if the scores are different change the order the player stats are displayed
		if(ticGlob.player1.score  !== ticGlob.player2.score ){
			// it works but there is a problem when one lement overtakes the other and then wins again
			arrangeScores();
				/*   - find the highest score and arrange them accordingly (heighest top- lowest bottom) -   */
			function arrangeScores(){
				var player = ticGlob.player1.score > ticGlob.player2.score ? "player-1" : "player-2";
				var playerDiv = '#' + player + '-stat';
				var content = $(playerDiv).html();
				var parent = $(playerDiv).parent();

									
				cnsl("content: " + content);
				cnsl("parent: " + parent);

				var htmlOuter= '<div id= "'+ player +'-stat">' +content+'</div>';

				 $(playerDiv).remove();

				 parent.prepend( htmlOuter );
			}
		}
		
		
		//console.log("hgihestElement: " + highestElement);

	}//---displayerWin() 
	

	/* it works moderately well but it's not choose the optimal spaces based on somethingg like the minimax algo.
	*/

	function runAiTurn(){

	

		cnsl("--runAiTurn()---","start");
	
		
		function randomChoice(arr){
			
			var rand = getRandomInt(0,arr.length-1);
			var selected = arr[rand];
			return selected;
		}
		
		
		function calculatedChoice(){
			cnsl("---calculatedChoice()---");


			
			// need to see if out of any of the choices there is one available to take which will create 3 in a row
			
			var canWinResult = canWin();

			cnsl("canWinResult : " + canWinResult);
			if(typeof canWinResult ==="number"){
				cnsl("bout to choose the winning choice!");
				return canWinResult;
			}
			var blockPlayerResult = blockPlayer();
			if(typeof blockPlayerResult==='number'){
				cnsl("bout to block the player! : " + blockPlayerResult);
				return blockPlayerResult;
			}
			
			// if this far it can't find a good option (just return random)
			cnsl("about to retunr a random choice in calcChoice");
			return randomChoice(ticGlob.avail)[2];


			// if no choices can make a win then you need to block the opponent from winning 
			/* you should check for win for the opponent and if the result shows true for any of the opponents squares you should select that square) */


			function canWin(){
				cnsl("---canWin()---","start");
				var counters = ticGlob[ticGlob.currPlayer]["counters"];
				

				
				var result = searchForAlmostWon();
				cnsl("check typeof result -> in canWin : " + typeof result);
				if(typeof result ==="number"){// if the id is returned and val isn't falsey
					cnsl("found id in can win!","success");
					return result; // this returns the ID;
				}else{
					cnsl("no id to be found in can win","fail");
				}

				// search for any values that are 1 less than the boardSize and then calls to a function to checkAvail
				function searchForAlmostWon(){

					for(var key in counters){
						//cnsl("key: " + key);
						for(var i=0; i<counters[key].length; i++){
							//cnsl(counters[key][i]);
							if(counters[key][i][1]===(ticGlob.boardSize - 1)){
								cnsl("almost found at " + counters[key][i]);
								var id;
								var foundId = findIfAvail(key,counters[key][i][0]);

								if(typeof foundId==='number'){ // if this is not undefined it means a result was returned!
									cnsl("found -> foundId: " + foundId);
									return foundId; 
								}
							}
						}
					}

					return false; // if this far return an undefined val

				}


	
				
				function findIfAvail(type,num){
					cnsl("---findIfAvail()--- type : " + type + " " + " num: " + num);
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
			function blockPlayer(){
				/* this basically needs to check the can win function but using the other player 
				switch back to the other player then make that choice */
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

		function miniMax(depth, player){
			
			cnsl("---miniMax()---","start");
	

			var opponent = player === "player1" ? "player2" : "player1";
			//	cnsl("opp : " + opponent);
			
			var availOrig = JSON.parse(JSON.stringify(ticGlob.avail));
			//	cnsl("origAvail : " + strify(availOrig));
			
			var choicesIndex = [];
			depth = 5;
			var depthOrigin = depth;
		//	cnsl("depthOrigin at start : " + depthOrigin + " and depth: " + depth);

			
			var miniMaxResult = miniMax_r(depth,availOrig);

			var choiceIndex;

			
			
			function miniMax_r(depth,avail){
				//	cnsl("-------miniMax_r()------- depth: " + depth + " avail.length : " + avail.length,"start");
					
					var val;
					var newVal;
					var valArr =[];
					var choiceArr=[];	
					
					var availReset = JSON.parse(JSON.stringify(avail));
					var playerOrig = JSON.parse(JSON.stringify(ticGlob[player]));
					var opponentOrig = JSON.parse(JSON.stringify(ticGlob[opponent]));
										
					/* BASE CASE */
					if(depth===0){ /* or node is a terminal node */  // node is like a state so you need to find out how to pass the current baord state in one variable
						//cnsl("depth hit!", "error");
						return "depth hit"; 
					}
	
					// simChoice simulates the adding and removing of values from ticGlob.avail and ticGLob.counters
					function simChoice(choice){
								var index = avail.indexOf(choice);
								
								//push the selected to the players chosen array
								var currPlayersChosen = ticGlob[ticGlob.currPlayer]["chosen"];
								currPlayersChosen.push(choice);
							
							
						
								avail.splice(index, 1); // delete 1 at the found index.
							
								if(choice){// if defined
							
									var winResult = incrementCounters(choice); // this function check for win and incrememnts counters for current player
									return winResult; // this return win or lose
								}	else{
								
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
							cnsl("ticGLob.currPlayer = " + ticGlob.currPlayer);
							if(ticGlob.currPlayer === opponent){	
								cnsl("currPlayer is opponent so will make val negative");
								val = -val;}
							cnsl("about to return " + val + " in createMmValue ...")
							return val;
					} 
					
					function resetSettings(){
							ticGlob.currPlayer  = ticGlob.currPlayer  === "player1" ? "player2" : "player1";
							ticGlob[player] = JSON.parse(JSON.stringify(playerOrig));
							ticGlob[opponent] = JSON.parse(JSON.stringify(opponentOrig));
							avail = JSON.parse(JSON.stringify(availReset));	
					}
					
					/* if its the first depth then  */
					if(avail.length === (ticGlob.boardSize*3) || avail.length === ((ticGlob.boardSize*3)-1) ){
						 
						cnsl("avail.length === (ticGlob.boardSize*3) || avail.length === (ticGlob.boardSize*3)-1");
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
						cnsl("choice : " + choice);
						

						choiceIndex = choice[2];
						
						simChoice(choice);
						
						//	cnsl("index of avail[i]: " + avail[i][2]);	
					}else{
					
						for(var i =0; i<avail.length; i++){
							cnsl("***[i] : " + i + " avail[i]: " + avail[i] + " depth : " + depth + " avail.length: " + avail.length );
	
							var choice = avail[i];	
							var currIndex = avail[i][2];
								
							var winResult = simChoice(avail[i]);
							
							
							// make negative if currplayer is opposition and * by depth
							var val = createMmValue(winResult); 

							if(val !== 0){ // if win
								cnsl("got win at i : " + i + " val : " + val + " will not recurse as it's not necessary ");
										valArr.push(val); // depth has already been applies
										choiceArr.push(choice);
										cnsl("just pushed choice: " + choice + " and val " + val + " in choiceArr : " + strify(choiceArr) + " in depth : " + depth + " avail.length: " + avail.length + " i : " + i);
									
										
							}else{ // its a draw so look into what the other player will do next
								
								ticGlob.currPlayer  = ticGlob.currPlayer  === "player1" ? "player2" : "player1";
							
								/* RECURSE!!!!! */
								var newVal =  miniMax_r(depth-1, avail );
								cnsl("back into loop depth: " + depth + "*** [i]: " + i ,"start");	
								if(typeof newVal === 'number'){ // to stop pushing 'depth hit'
										valArr.push(newVal);
										choiceArr.push(choice);
										cnsl("just pushed choice: " + choice + " and val " + newVal + " in choiceArr : " + strify(choiceArr));		
								}else{
									cnsl("typeof newVal is not number");
								}			
							
								// reset settings after recrusion 
								resetSettings();
								//updateMinMaxVal(newVal,currIndex);				
							}
							
							
							//cnsl("---* end of loop depth: " + depth + " choice: " + choice +   " avail.length : " +avail.length + " [i] :" + i + " val: "+ val + " newVal : " + newVal + " highestVal: " + highestVal,"end");
									
						}// END OF FOR LOOP 

					}// end of else // not the the first move

					
						
						/* -----------------CHOOSE THE VALUE TO RETURN  ----------------------*/

						var chosenVal;

						cnsl("valArr: " + strify(valArr));
						cnsl("choiceArr: " + strify(choiceArr));
				
						if(choiceArr.length !== 0){	 	
							if(ticGlob.currPlayer===player){
									cnsl("will look for max");	
									chosenVal = valArr[indexOfMax(valArr)] ;
									choiceIndex = choiceArr[ indexOfMinOrMax(valArr, "max") ][2]; // UPDATE GLOBAL CHOICE INDEX
							}else{// === opponent					
									cnsl("will look for min ");	
									chosenVal = valArr[indexOfMin(valArr)] ; 
									choiceIndex = choiceArr[ indexOfMinOrMax(valArr, "min") ][2]; // UPDATE GLOBAL CHOICE INDEX
							}	
							cnsl("chosenVal: " + chosenVal);
						}

					//var finalVal = ticGlob.currPlayer===opponent ? highestVal= -(highestVal) : highestVal; // make final val negative if opponent
						
						//cnsl("---choiceIndex after loop: " + choiceIndex + " at depth :" + depth + " of highestVal :" + highestVal, "info" );
					

					// check to see if a chosenVal exists
					if (typeof chosenVal ==='number'){
					//	cnsl("about to return chosenVal: " + chosenVal + " at depth : " + depth);
						return chosenVal;
					}else{
						cnsl("chosen val not set so willreturn 0: ");
						return 0;
					}
					
			}// miniMax_r()
					
					/* simple functions returning the index of the max or min array respectively */
					function indexOfMax(arr) {// would be nice the max values in the arr and randomly return one (not just the first max val)
							   
							   cnsl(" in index of max ()");
							    var max = arr[0];
							    var indexArr=[];
							    var maxArr=[];
							    for (var i = 0; i < arr.length; i++) {
							        if (arr[i] > max) {        	// if current is bigger than max create new maxArr
							        	cnsl("arr[i]: " +arr[i]+ " > max: " + max );
							        	max = arr[i]; 
							        	
							        	maxArr=[]; // empty maxArr
							        	indexArr=[];

							        	maxArr.push(arr[i]);
							         	indexArr.push(i);
							        }else if( arr[i]===max){   	// same as max so add to maxArr
							     		cnsl("arr[i]: " +arr[i]+ " ===max: " + max );
							        	maxArr.push(arr[i]);
							         	indexArr.push(i);
							        }
							    }
							    cnsl("maxArr: " + maxArr);
							    cnsl("indexArr: "+ indexArr);

							    var randomNum =getRandomInt(0,indexArr.length-1);
							   
							   cnsl("about to return  indexArr[randomNum]: " +  indexArr[randomNum]);
							    return indexArr[randomNum]; // this needs to retunr an index number from the original arr		      
					}
					function indexOfMin(arr) {
							
							   cnsl(" in index of min ");
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
						
							cnsl("in minOrMaxFromArr() ---  with arr : " + arr );
							
							 var indexArr=[];
							 var extremumArr=[];

							 var extremum = arr[0];
	
							 	if(minOrMax==="max"){
							 			cnsl("minOrMax = max");
							 		   for (var i = 0; i < arr.length; i++) {
							 		   	cnsl("*** i : " +i+ " arr[i]:"  + arr[i] + " extremum : " + extremum);
									        if (   arr[i] > extremum ) {        	// if current is bigger than max create new maxArr
									        //	cnsl("arr[i]: " +arr[i]+ " typeof arr[]i] " +typeof arr[i]+ " > extremum: " + exremum );
									        	
									        	extremum = arr[i]; // new extremum 
									 
									        	extreumumArr=[]; 
									        	indexArr=[];

									        	extreumumArr.push(arr[i]);
									         	indexArr.push(i);
										     }else if( arr[i]===extremum){   	// same as max so add to maxArr
										     	//	cnsl("arr[i]: " +arr[i]+ " ===extremum: " + extremum );
										        	extremumArr.push(arr[i]);
										         	indexArr.push(i);
										     }
										     cnsl("maxArr now : " + extremumArr);
										 }

							 	}else{
							 			cnsl("minOrMax = max");
							 	 // extremum ==="min"

							 			 for (var i = 0; i < arr.length; i++) {
									        if (arr[i] < extremum) {        	// if current is bigger than max create new maxArr
									        //	cnsl("arr[i]: " +arr[i]+ " > extremum: " + extremum );
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
							 	cnsl("arr: " + arr);
							 	cnsl("extreumumArr: " + extremumArr);
							    cnsl("indexArr: "+ indexArr);
							    var randomNum =getRandomInt(0,indexArr.length-1);	   
							    cnsl("--------------- about to return  indexArr[randomNum]: " +  indexArr[randomNum] + " at extremum : " + extremum  );
							   
							
							    return indexArr[randomNum]; // this needs to retunr an index number from the original arr

						}// end of function


		//	cnsl("miniMaxResult : " + miniMaxResult);
		
			cnsl("---miniMax()---","end");



			return choiceIndex;
		

		}// miniMax()


		var gridSpaceId;
		
		var aiChoice;

		cnsl("ticGlob.difficulty before swithc: " + ticGlob.difficulty);
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
		    default:
		        cnsl("default");
		}
		//var calcChoice = calculatedChoice() ;
		
		/*
			var miniMaxChoice = miniMax(3, ticGlob.currPlayer);

			ticGlob = originalTicGlob;

			cnsl(strify("ticGLob after reset: " + ticGlob)); // reset the glob

			cnsl("miniMaxChoice:  " + miniMaxChoice);
		*/
		/*

		if(typeof calcChoice === 'number'){// if not undefined
			gridSpaceId = calcChoice + 1;
		}else{
			gridSpaceId = randomChoice(ticGlob.avail)[2] + 1; // add one as grid-space-1 ->grid-space-9
		}
	*/

		cnsl("--runAiTurn()---","end");

		processChoice(aiChoice); // miniMaxChoice

	}// ---runAiTurn()

	/*   - for resetting the board to the default state -   */
	function resetBoard(delay,win){
		cnsl("--- resetBoard()---");
		toggleClickable(false);	

		if(delay){
			delay = delay*1000;
		}else{
			delay = 0;
		}
			
		setTimeout(function(){ 
			cnsl("timer done about to reset");
			
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

	//it's not running the AI for the change player

	
	
});

	