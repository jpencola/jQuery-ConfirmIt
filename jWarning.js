


/****************************************************
POST, LINK AND REDIRECT FUNCTIONS
****************************************************/

var clickedInput;
function initConfirm() {
	/*
	TO ADD CONFIRM CLICK ACTION FOR FORMS:
	give any input submit button the class "confirm" 
	give the button a 'title' attribute with the confirmation message (ToolTip for asp controls)
	*/
	$("input").click(function (event) {
		clickedInput = this;
	});

	$("form").submit(function () {

	    trace("form submitted");

	    var confirmClick = $(clickedInput).hasClass("confirm");
	    if (confirmClick) {
	        var msg = $(clickedInput).attr("title");
	        if (!msg)
	            msg = "Are you sure you wish to perform this action?";
	        return confirm(msg);
	    }

	    return true;
	});
  
	$("a").click(function (event) {
	
		clickedInput = this;
		var confirmClick = $(clickedInput).hasClass("confirm");
		if (confirmClick) {
			var msg = $(clickedInput).attr("title");
			if (!msg)
				msg = "Are you sure you wish to perform this action?";
		  
				var answer = confirm(msg);
				if (!answer)
					event.preventDefault();
		}
		
	});
}