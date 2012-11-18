//==============================================================================================
//AUTHOR: KARAN KHIANI | BUKKETFULL FOR BB10
//==============================================================================================

//Function that lists all the existing items from localStorage
function listItems(){
	$('#bucket-item-list').append('');
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
function randomSuggestion(){
	var randomItems = new Array("Travel to Argentina", "");
}