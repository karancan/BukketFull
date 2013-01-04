//==============================================================================================
//AUTHOR: KARAN KHIANI | BUKKETFULL FOR BB10
//==============================================================================================

//Function called when the body loads- deals with main DB connection
function initDB(){
	console.log("initialize db");
	db = openDatabase('bukketfull', '1.0', 'DB used by the BukketFull app', 2 * 1024 * 1024);
	console.log("db opened");
	db.transaction(function (tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS items (id INT PRIMARY KEY AUTOINCREMENT, title TEXT, status INT)');
		console.log("table created");
		tx.executeSql('INSERT INTO items (title, status) VALUES ("test value", "0")');
		console.log("inserted a row");
	});
	//Now that we have established whether the DB table exists, we can list all existing items
	listItems();
}

//Function that lists all the existing items if any
function listItems(){
	console.log("In the list items function");
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM items', [], function (tx, results) {
			console.log("fetching item");
			console.log("results");
			var len = results.rows.length, i;
			//Check if there are any items already- if yes then show them
			for (i = 0; i < len; i++) {
				console.log(results.rows.item(i).title);
				console.log(results.rows.item(i).status);
			}
			//Check if there are any items already- if not then show a message saying that there are none
		});
	});
}

//Function that runs when the user selects an existing item
function selectItem(){
	//Make the selected item the existing ITEM global object
}

//Function that is run when the user changes the completion status of a selected item
function switchItemStatus(){
	//Look at the existing status of the currently select ITEM global object
}

//Function that runs when the user is adding an item to the bucket list
$("#confirm-add").live('click',function() {
	
	//Error checking
	if($('#bucket-text').val() == ""){
		alert("You cannot do that!");
	}
	
});

//Function that gives the user random suggestions for bucket list items to add
$("#get-random").live('click',function() {
	var randomItems = new Array("Travel to Argentina", "Eat African cuisine", "Hike the Grand Canyon", "Climb Mount Everest", "Dive the Great Barrier Reef", "Visit the Taj Mahal", "Throw a coin in the Trevi Fountain");
	$('#bucket-text').val(randomItems[Math.floor(Math.random()*randomItems.length)]);
});