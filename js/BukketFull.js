//==============================================================================================
//AUTHOR: KARAN KHIANI | BUKKETFULL FOR BB10
//==============================================================================================

var db;
selectedItem = new Object();

//A function that clears the selectedItem object
function selectedItemReset(){
	selectedItem.id = "";
	selectedItem.title = "";
	selectedItem.status = "";
	selectedItem.image_path = "";
	selectedItem.geolocation = "";
}

//A database error callback function- used for troubleshooting
dbError = function(tx, e) {
	console.log("DB Transaction ERROR: " + e.message);
}

//A database success callback function- used for troubleshooting
dbSuccess = function(tx, e) {
	console.log("DB Transaction Success: " + e.message);
}

//An invoke error callback function- used for troubleshooting
invokeError = function(error) {
	console.log("Invocation ERROR: " + error );
}

//An invoke success callback function- used for troubleshooting
invokeSuccess = function() {
	console.log("Invocation Success");
}		
		
//Function called when the body loads- deals with main DB connection
function initDB(){
	db = openDatabase('bukketfull', '1.0', 'DB used by the BukketFull app', 2 * 1024 * 1024);
	db.transaction(function (tx) {
		tx.executeSql('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, status INTEGER, image_path TEXT, geolocation TEXT)', [], dbSuccess, dbError);
		//dropTable(); //This line will be commented out unless we are testing and want to drop the entire table
		listItems();
	});
}

//Function that clears the existing items table- used for testing
function dropTable(){
	db.transaction(function (tx) {
		tx.executeSql('DROP TABLE items', [], dbSuccess, dbError);
	});
}

//Function that lists all the existing items if any
function listItems(){
	
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM items', [], function (tx, results) {
			//selectedItemReset();
			var len = results.rows.length, i;
			//There are existing items- show them all
			if (len > 0) {
				//Prepare the start of the list markup
				var body_content_start = '<ul id="list-body-list" data-filter="true" data-role="listview" data-divider-theme="b">';
				var body_content_incomplete = '<li data-role="list-divider" role="heading" data-theme="a" id="bucket-item-list-incomplete"><h1>Incomplete</h1></li>';
				var body_content_complete = '<li data-role="list-divider" role="heading" data-theme="a"><h1>Complete</h1></li>';
				var count_complete = 0;
				var count_incomplete = 0;
				for (i = 0; i < len; i++) {
					//Prepare the list of incomplete items
					if (results.rows.item(i).status == "0"){
						count_incomplete ++; 
						body_content_incomplete += '<li class="item-selector" name="' + results.rows.item(i).id + '"><img src="img/photo.png" alt="list thumbnail">' + ((results.rows.item(i).title).length > 21 ? (results.rows.item(i).title).substring(0, 21) + "..." : results.rows.item(i).title) + '</li>';
					}
					//Prepare the list of completed items
					if (results.rows.item(i).status == "1"){
						count_complete ++;
						body_content_complete += '<li class="item-selector" name="' + results.rows.item(i).id + '"><img src="img/photo.png" alt="list thumbnail">' + ((results.rows.item(i).title).length > 21 ? (results.rows.item(i).title).substring(0, 21) + "..." : results.rows.item(i).title) + '</li>';
					}
				}
				//Prepare the end of list markup and append it to the body
				var body_content_end = '</ul>';
				//Injected code will depend on whether there are incomplete items, complete items or both
				if ((count_incomplete > 0) && (count_complete == 0)){
					var all_markup = body_content_start.concat(body_content_incomplete, body_content_end);
				}
				else if ((count_complete > 0) && (count_incomplete == 0)){
					var all_markup = body_content_start.concat(body_content_complete, body_content_end);
				}
				else{
					var all_markup = body_content_start.concat(body_content_incomplete, body_content_complete, body_content_end);
				}
				$('#list-body').html(all_markup);
				$("#list-body").find(":jqmData(role=listview)").listview();
			}
			//There are no existing items, show a friendly message
			else{
				$('#list-body').html('<center><div id="list-empty-message">Wow! Your list is all empty.</br> You must find this world of ours really boring...</div></center>');
			}
		}, dbError);
	});
}

//Functions that takes care of clearing the list DOM and refreshing it when appropriate
function viewListItems(){
	$.mobile.changePage( "index.htm", { transition: "flip", type: "get"} );
}

//Function that runs when the user selects an existing item
$(".item-selector").live('click',function() {
	selectedItem.id = $(this).attr('name');
	db.transaction(function (tx) {
		tx.executeSql('SELECT * FROM items WHERE id=?', [selectedItem.id], function (tx, results) {
			selectedItem.title = results.rows.item(0).title;
			selectedItem.status = results.rows.item(0).status;
			selectedItem.image_path = results.rows.item(0).image_path;
			selectedItem.geolocation = results.rows.item(0).geolocation
			$('#bubble').html(selectedItem.title);
			$.mobile.changePage( "view.htm", { transition: "flip", type: "get"} );
		}, dbError);	
	});
});

//This function takes cares of some UI manipulation that needs to be done once the view page has been loaded
$("div[id*='view-page']").live('pageshow', function(event, ui) {
	$('#bubble').html(selectedItem.title);
	if (selectedItem.status == "1"){
		$('#selected-item-mark-complete').hide();
	}
	if (selectedItem.status == "0"){
		$('#selected-item-mark-incomplete').hide();
	}
});

//Function that is run when the user marks the selected item as complete
$('#selected-item-mark-complete').live('click',function() {
	db.transaction(function (tx) {
		tx.executeSql('UPDATE items SET status="1" WHERE id=?', [selectedItem.id], dbSuccess, dbError);
		$('#selected-item-mark-complete').hide();
		$('#selected-item-mark-incomplete').fadeIn();
		listItems();
	});
});

//Function that is run when the user marks the selected item as incomplete
$('#selected-item-mark-incomplete').live('click',function() {
	db.transaction(function (tx) {
		tx.executeSql('UPDATE items SET status="0" WHERE id=?', [selectedItem.id], dbSuccess, dbError);
		$('#selected-item-mark-incomplete').hide();
		$('#selected-item-mark-complete').fadeIn();
		listItems();
	});
});

//Function that is run when the user deletes the selected item
$('#selected-item-delete').live('click',function() {
	var double_check = confirm("Are you sure you want to delete this from your list?");
	if (double_check == true){
		initDB();
		db.transaction(function (tx) {
			tx.executeSql('DELETE FROM items WHERE id=?', [selectedItem.id], dbSuccess, dbError);
			listItems();
			viewListItems();	
		});
	}
});

//Function that runs when the user wants to share the item on facebook
$('#selected-item-share-facebook').live('click', function() {
	blackberry.invoke.invoke({
        target: "Facebook",
        action: "bb.action.SHARE",
        type: "text/plain",
        data: "I have \"" + selectedItem.title + "\" on my bucket list on my BlackBerry 10 phone :)"
    }, invokeSuccess, invokeError);
});

//Function that runs when the user wants to share the item on twitter
$('#selected-item-share-twitter').live('click', function() {
	blackberry.invoke.invoke({
        target: "Twitter",
        action: "bb.action.SHARE",
        type: "text/plain",
        data: "I have \"" + selectedItem.title + "\" on my bucket list on my BlackBerry 10 phone :)"
    }, invokeSuccess, invokeError);
});

//Function that runs when the user is adding an item to the bucket list
$("#confirm-add").live('click',function() {
	
	//Error checking
	if($('#bucket-text').val() == ""){
		alert("You must enter a description.");
		return;
	}
	
	//Error checking done- need to insert the row
	db.transaction(function (tx) {
		tx.executeSql('INSERT INTO items (title, status) VALUES (?, ?)', [($('#bucket-text').val()),("0")], dbSuccess, dbError);
		listItems();
		viewListItems();
	});
});

//Function that runs when the user is adding an item to the bucket list
$("#image-gallery").live('click',function() {
	/*var details = {
          mode: blackberry.invoke.card.FILEPICKER_MODE_PICKER,
          type: [blackberry.invoke.card.FILEPICKER_TYPE_PICTURE]
    };
	blackberry.invoke.card.invokeFilePicker(details, function (path) {
			alert("saved "+ path);
		},
        function (reason) {
			alert("cancelled " + reason);
        },
        function (error) {
            if (error) {
                alert("invoke error "+ error);
            } else {
                console.log("invoke success " );
            }
        }
    ); */
});

//Function that gives the user random suggestions for bucket list items to add
$("#get-random").live('click',function() {
	var randomItems = new Array("Travel to Argentina", "Eat African cuisine", "Hike the Grand Canyon", "Climb Mount Everest", 
								"Dive the Great Barrier Reef", "Visit the Taj Mahal", "Throw a coin in the Trevi Fountain",
								"Swim with Dolphins", "Walk the Great Wall of China", "Climb Mt. Kilimanjaro", "Ski the Alps",
								"Backpack across Europe", "Visit the Palm Islands in Dubai", "Snowboard in Whistler, BC", 
								"Make a million dollars");
	$('#bucket-text').val(randomItems[Math.floor(Math.random()*randomItems.length)]);
});