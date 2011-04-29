(function($){
	$.fn.confirmIt = function(options){
		//	default settings
		var settings = {
			triggered_by: "click",
			message: "Are you sure?"
		};

		//	apply any options overrides
		$.extend(settings, options);
		
		//	for each matching confirm element...
		//	remember any event handlers bound to it
		//	then remove any event handlers from the element	
		//	if the element has no event handlers then do nothing
		$(this).each(function() {
			var element_event_matches_trigger;
			var element = $(this);
			var events_data = element.data("events");
			for (var key in events_data){
				if (events_data[key].length > 0){
					if (events_data[key][0].type == settings.triggered_by){
						rememberEventHandler(element);
						removeEventHandler(element);
						bindConfirmHandler(element);
						break;
					}
				}
			}
		});
		
		//	stashes existing trigger event from the element
		function rememberEventHandler(element){
			var events = element.data("events");
			var event_memory = [];
			for (var event in events){
				var event_object = events[event][0];
				if (event_object.type == settings.triggered_by){
					event_memory.push({
						type: event_object.type,
						handler: event_object.handler
					});
					break;
				}
			}
			element.data('__deferred_event_handlers__', event_memory);
		};
		
		//	un-binds a trigger event from the element
		function removeEventHandler(element){
			element.unbind(settings.triggered_by);
		};
		
		//	re-binds a pre-existing trigger event to the element
		function restoreEventHandler(element){
			var events = element.data().__deferred_event_handlers__;
			for (var event in events){
				var event_type = events[event].type;
				var event_handler = events[event].handler;
				element.unbind(event_type);
				element.bind(event_type, event_handler);
				element[event_type]();
				element.unbind(event_type);
				bindConfirmHandler(element);
			}
		};

		//	Extracts the confirmation message from the element 
		//	HTML5 data attribute is prefferred...
		//	then the class attribute...
		//	finally, fall back on the default message in settings
		function getConfirmMessage(element){
			var confirm_message, classname = element.attr('class');
			confirm_message = element.attr('data-confirmit-message');
			if (!confirm_message) confirm_message = classname.substring(classname.indexOf("{")+1, classname.lastIndexOf("}")).split(":")[1]; // good candidate for a regexp
			if (!confirm_message) confirm_message = settings.message;
			return confirm_message;
		};
		
		//	binds the confirm handler to the specified trigger event
		function bindConfirmHandler(element){
			element.bind(settings.triggered_by, (function(){showConfirm(element, getConfirmMessage(element))}));
		};
		
		//	the handler that intercepts the action
		function showConfirm(target_element, message){
			var confirmed = window.confirm(message);
			if (confirmed){
				restoreEventHandler(target_element);
				return false;
			} else {
				return true;
			}
		};
	};
})(jQuery);

//TODO: remove this later...
function trace(msg){try{console.log(msg)}catch(ex){}};