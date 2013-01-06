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
	
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM items', [], function (tx, results) {
			var len = results.rows.length, i;
			console.log(len);
			//There are existing items- show them all
			if (len > 0) {
				//Prepare the start of the list markup
				var body_content_start = '<ul data-filter="true" data-role="listview" data-divider-theme="b">';
				var body_content_incomplete = '<li data-role="list-divider" role="heading" data-theme="a" id="bucket-item-list-incomplete"><h1>Incomplete</h1></li>';
				var body_content_complete = '<li data-role="list-divider" role="heading" data-theme="a"><h1>Complete</h1></li>';
				for (i = 0; i < len; i++) {
					//Prepare the list of incomplete items
					if (results.rows.item(i).status == "0"){
						body_content_incomplete += '<li><a name="' + results.rows.item(i).id + '" href="view.htm" data-transition="flip"><img src="img/photo.png" alt="list thumbnail" style="padding-left: 0.1em;">' + results.rows.item(i).title + '</a></li>';
					}
					//Prepare the list of completed items
					if (results.rows.item(i).status == "1"){
						body_content_complete += '<li><a name="' + results.rows.item(i).id + '" href="view.htm" data-transition="flip"><img src="img/photo.png" alt="list thumbnail" style="padding-left: 0.1em;">' + results.rows.item(i).title + '</a></li>';
					}
				}
				//Prepare the end of list markup and append it to the body
				var body_content_end = '</ul>';
				var all_markup = body_content_start.concat(body_content_incomplete, body_content_complete, body_content_end);
				$('#list-body').html(all_markup);
			}
			//There are no existing items, show a friendly message
			else{
				$('#list-body').html('<center><div style="height: 100%; color: #263849; padding: 2em; font-size: 4em;">Wow! Your list is all empty.</br> You must find the world really boring...</div></center>');
			}
		}, dbError);
	});
}

//Functions that takes care of clearing the list DOM and refreshing it when appropriate
function viewListItems(){
	window.location = "list.htm";
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
		alert("You cannot leave that field blank.");
		return;
	}
	
	//Error checking done- need to insert the row
	db.transaction(function (tx) {
		tx.executeSql('INSERT INTO items (title, status) VALUES (?, ?)', [($('#bucket-text').val()),("0")], dbSuccess, dbError);
		listItems();
		viewListItems();
	});
});

//Function that gives the user random suggestions for bucket list items to add
$("#get-random").live('click',function() {
	var randomItems = new Array("Travel to Argentina", "Eat African cuisine", "Hike the Grand Canyon", "Climb Mount Everest", "Dive the Great Barrier Reef", "Visit the Taj Mahal", "Throw a coin in the Trevi Fountain");
	$('#bucket-text').val(randomItems[Math.floor(Math.random()*randomItems.length)]);
});