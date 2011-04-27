(function($){
	$.fn.confirmIt = function(method, options){
		//	default settings
		var settings = {
			selector: ".confirmit",
			triggered_by: {'name': 'click'}
		};
		
		//	apply any options overrides
		$.extend(settings, options);
		
		//	for each matching confirm element...
		//	remember any event handlers bound to it
		//	then remove any event handlers from the element	
		//	if the element has no event handlers then do nothing
		$(settings.selector).each(function() {
			var element = $(this);
			if (element.data("events")){
				rememberEventHandler(element);
				element.unbind();
				element.one(settings.triggered_by.name, onConfirm);
			} else {
				return;
			}
		});
		
		//	the handler that intercepts the action
		function onConfirm(){
			var classname = $(this).attr('class');
			var message = classname.substring(classname.indexOf("{")+1, classname.lastIndexOf("}")).split(":")[1]; // good candidate for a regexp
			trace("confirm: "+message);
			return false;
		};
		
		//	stashes existing bound events on the element
		function rememberEventHandler(element){
			element.data('__deferred_event_handlers__', element.data("events"));
		};
	};
})(jQuery);

//TODO: remove this later...
function trace(msg){try{console.log(msg)}catch(ex){}};