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
			var element_event_matches_trigger;
			var element = $(this);
			var events_data = element.data("events");
			for (var key in events_data){
				if (events_data[key].length > 0){
					if (events_data[key][0].type == settings.triggered_by){
						element_event_matches_trigger = true;
						break;
					}
				}
			}
			if (element_event_matches_trigger){
				rememberEventHandler(element);
				removeEventHandler(element);
				bindConfirmHandler(element);
			} else {
				return;
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
		
		//	un-binds trigger event from the element
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
		
		//	initializes the confirm handler to the specified trigger events
		function bindConfirmHandler(element){
			var classname = element.attr('class');
			var confirm_message = classname.substring(classname.indexOf("{")+1, classname.lastIndexOf("}")).split(":")[1]; // good candidate for a regexp
			element.bind(settings.triggered_by, (function(){showConfirm(element, confirm_message)}));
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