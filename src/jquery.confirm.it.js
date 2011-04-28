(function($){
	$.fn.confirmIt = function(options){
		//	default settings
		var settings = {
			triggered_by: 'click'
		};

		//	apply any options overrides
		$.extend(settings, options);
		
		//	for each matching confirm element...
		//	remember any event handlers bound to it
		//	then remove any event handlers from the element	
		//	if the element has no event handlers then do nothing
		$(this).each(function() {
			var element = $(this);
			if (element.data("events")){
				rememberEventHandlers(element);
				element.unbind();
				var classname = element.attr('class');
				var confirm_message = classname.substring(classname.indexOf("{")+1, classname.lastIndexOf("}")).split(":")[1]; // good candidate for a regexp
				element.bind(settings.triggered_by, (function(){showConfirm(element, confirm_message)}));
			} else {
				return;
			}
		});
		
		//	the handler that intercepts the action
		function showConfirm(target_element, message){
			var confirmed = window.confirm(message);
			if (confirmed){
				
			} else {
				return false;
			}
		};
		
		//	stashes existing bound events on the element
		function rememberEventHandlers(element){
			element.data('__deferred_event_handlers__', element.data("events"));
		};
	};
})(jQuery);

//TODO: remove this later...
function trace(msg){try{console.log(msg)}catch(ex){}};