




function trace(msg){console.log(msg)}
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
	$("input,button").click(function (event) {
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


var CONFIRM_LEAVE_SITE = "Exit Notice: The appearance of external hyperlinks does not constitute endorsement by the Federal Acquisition Institute of this Web site or the information, products, or services contained therein. For other than authorized activities such as military exchanges and MWR sites, the federal government does not exercise any editorial control over the information you may find at these locations. Such links are provided consistent with the stated purpose of this Web site.";
function initExternalLinkWarning() {

	jQuery("a").click(function (event) {
		href = jQuery(this).attr("href");

		if (!href)
			return;
		lowerHref = href.toLowerCase();

		var isExternal = (lowerHref.indexOf("http") == 0);
		var isMilitary = (lowerHref.indexOf(".mil") != -1);
		var isGov = (lowerHref.indexOf(".gov") != -1);
		var isAtrrs = (lowerHref.indexOf("atrrs") != -1);

		if (isExternal && !isMilitary && !isGov && !isAtrrs) {
		  /*  try {

				jConfirm(CONFIRM_LEAVE_SITE, 'Leave Atrrs Site?', function (r) {
					trace('Confirmed: ' + r);
					if (r)
						window.open(href);
				});
				event.preventDefault();
			}
			catch (e) {*/
				var answer = confirm(CONFIRM_LEAVE_SITE);
				if (!answer)
					event.preventDefault();
		   /* }*/
		}
	});
}




/*
var formChanged = false;

$(document).ready(function() {
     $('form input[type=text].editable, form textarea.editable').each(function (i) {
          $(this).data('initial_value', $(this).val());
     });

     $('form input[type=text].editable, form textarea.editable').keyup(function() {
          if ($(this).val() != $(this).data('initial_value')) {
               handleFormChanged();
          }
     });

     $('form .editable').bind('change paste', function() {
          handleFormChanged();
     });

     $('.navigation_link').bind("click", function () {
          return confirmNavigation();
     });
});

function handleFormChanged() {
     $('#save_or_update').attr("disabled", false);
     formChanged = true;
}

function confirmNavigation() {
     if (formChanged) {
          return confirm('Are you sure? Your changes will be lost!');
     } else {
          return true;
     }
}
*/



function LeaveWarning(e) {
  var message = "It looks like you have unfinished business. Leave this page?",
  e = e || window.event;
  // For IE and Firefox
  if (e) {
    e.returnValue = message;
  }

  // For Safari
  return message;
};
