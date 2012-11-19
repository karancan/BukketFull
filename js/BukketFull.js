//==============================================================================================
//AUTHOR: KARAN KHIANI | BUKKETFULL FOR BB10
//==============================================================================================

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
	
	if (localStorage.getItem("numItems") == undefined){
		localStorage.setItem("numItems", 1);
	}
	else{
		numItems = localStorage.getItem("numItems");
		numItems++;
		localStorage.setItem("numItems", numItems);
	}
	var numItems = localStorage.getItem("numItems");
	localStorage.setItem("item" + numItems, $('#bucket-text').val());
	
});

//Function that gives the user random suggestions for bucket list items to add
$("#get-random").live('click',function() {
	var randomItems = new Array("Travel to Argentina", "Eat African cuisine", "Hike the Grand Canyon", "Climb Mount Everest", "Dive the Great Barrier Reef", "Visit the Taj Mahal", "Throw a coin in the Trevi Fountain");
	$('#bucket-text').val(randomItems[Math.floor(Math.random()*randomItems.length)]);
});