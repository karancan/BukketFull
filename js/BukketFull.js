//==============================================================================================
//AUTHOR: KARAN KHIANI | BUKKETFULL FOR BB10
//==============================================================================================

var db;

//An error callback function- used for troubleshooting
dbError = function(tx, e) {
	console.log("ERROR: " + e.message);
}

//A success callback function- used for troubleshooting
dbSuccess = function(tx, e) {
	console.log("Success: " + e.message);
}
		
//Function called when the body loads- deals with main DB connection
function initDB(){
	db = openDatabase('bukketfull', '1.0', 'DB used by the BukketFull app', 2 * 1024 * 1024);
	db.transaction(function (tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, status INTEGER)', [], dbSuccess, dbError);
		//clearAllItems(); //This line will be commented out unless we are testing and want to clear the table of items
		//Now that we have established whether the DB table exists, we can list all existing items
		listItems();
	});
}

//Function that clears the existing items table- used for testing
function clearAllItems(){
	db.transaction(function (tx) {
		tx.executeSql('DROP TABLE items', [], dbSuccess, dbError);
	});
}

//Function that lists all the existing items if any
function listItems(){
	
	//Let's first clear up the DOM so we can start fresh- TO BE COMPLETED

	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM items', [], function (tx, results) {
			var len = results.rows.length, i;
			console.log(len);
			//Check if there are any items already- if yes then show them
			if (len > 0) {
				for (i = 0; i < len; i++) {
					console.log(results.rows.item(i).id);
					console.log(results.rows.item(i).title);
					console.log(results.rows.item(i).status);
				}
			}
			else{
				//Check if there are any items already- if not then show a message saying that there are none- TO BE COMPLETED
			}
		}, dbError);
	});
}

//Function that runs when the user selects an existing item
function selectItem(){
	//Make the selected item the existing ITEM global object- TO BE COMPLETED
}

//Function that is run when the user changes the completion status of a selected item
function switchItemStatus(){
	//Look at the existing status of the currently select ITEM global object- TO BE COMPLETED
}

//Function that runs when the user is adding an item to the bucket list
$("#confirm-add").live('click',function() {
	
	//Error checking
	if($('#bucket-text').val() == ""){
		alert("You cannot do that!");
		return;
	}
	
	//Error checking done- need to insert the row
	db.transaction(function (tx) {
		tx.executeSql('INSERT INTO items (title, status) VALUES (?, ?)', [($('#bucket-text').val()),("0")], dbSuccess, dbError);
		listItems();
	});
});

//Function that gives the user random suggestions for bucket list items to add
$("#get-random").live('click',function() {
	var randomItems = new Array("Travel to Argentina", "Eat African cuisine", "Hike the Grand Canyon", "Climb Mount Everest", "Dive the Great Barrier Reef", "Visit the Taj Mahal", "Throw a coin in the Trevi Fountain");
	$('#bucket-text').val(randomItems[Math.floor(Math.random()*randomItems.length)]);
});