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
		tx.executeSql('SELECT * FROM items', [], function (tx, results) {
			console.log("fetching item");
			var len = results.rows.length, i;
			for (i = 0; i < len; i++) {
				console.log(results.rows.item(i).title);
				console.log(results.rows.item(i).status);
			}
		});
	});
}

//Function that lists all the existing items from localStorage
function listItems(){
	//$('<li><a href="view.htm" data-transition="flip"><img src="img/mask.png" alt="list thumbnail" style="padding: 0.2em;">Will this work</a></li>').insertAfter($('#bucket-item-list-incomplete'));
}

//Function that runs when the user is adding an item to the bucket list
$("#confirm-add").live('click',function() {
	
	//Error checking
	if($('#bucket-text').val() == ""){
		return;
	}
	
});

//Function that gives the user random suggestions for bucket list items to add
$("#get-random").live('click',function() {
	var randomItems = new Array("Travel to Argentina", "Eat African cuisine", "Hike the Grand Canyon", "Climb Mount Everest", "Dive the Great Barrier Reef", "Visit the Taj Mahal", "Throw a coin in the Trevi Fountain");
	$('#bucket-text').val(randomItems[Math.floor(Math.random()*randomItems.length)]);
});