(function($){
	$.fn.confirmIt = function(options){
		//	default settings
		var settings = {
			triggered_by: "click",
			message: "Are you sure?"
		};

		//	apply any options overrides
		$.extend(settings, options);
		
		//	listen for future elements added to the DOM 
		$('body').bind('DOMNodeInserted', function(event){initConfirm($(event.target))});
		
		//	for each matching element that needs a confirmation step...
		//	iterate over all events that it has currently bound
		//	find the events that match the triggered_by name
		//	store them for retrieval later
		//	un-bind all of them
		//	bind the confirm event so it is the first one in the bubbling phase
		//	re-bind all the other events
		$(this).each(function() {
			var element = $(this);
			initConfirm(element);
		});
		
		//	re-orders the event handlers for the element that needs a confirmation
		function initConfirm(element){
			var events_data = element.data("events");
			var hasEvents = !!events_data;
			var hasTriggerEvent = (function(){try{return !!events_data[settings.triggered_by]}catch(ex){return false}})();
			if (hasEvents && hasTriggerEvent){
				var trigger_events = events_data[settings.triggered_by];
				var event_memory = [];
				for (var event in trigger_events){
					rememberEventHandlers(element, event_memory);
					removeEventHandlers(element);
					bindConfirmHandler(element);
					restoreEventHandlers(element);
				}
			}
		};
		
		//	stashes existing trigger events for re-use later
		function rememberEventHandlers(element, event_memory){
			var events = element.data("events");
			for (var event in events){
				for (var i=0, count=events[event].length; i<count; i++){
					var event_object = events[event][i];
					if (event_object.type == settings.triggered_by){
						event_memory.push({
							type: event_object.type,
							handler: event_object.handler
						});
					}
				}
			}
			element.data('__deferred_event_handlers__', event_memory);
		};
		
		//	un-binds trigger events from the element
		function removeEventHandlers(element){
			element.unbind(settings.triggered_by);
		};
		
		//	re-binds pre-existing trigger events to the element
		function restoreEventHandlers(element){
			var events = element.data().__deferred_event_handlers__;
			for (var event in events){
				var event_type = events[event].type;
				var event_handler = events[event].handler;
				element.bind(event_type, event_handler);
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
			element.bind(settings.triggered_by, (function(e){showConfirm(e, element, getConfirmMessage(element))}));
		};
		
		//	Display a confirm dialog: If the user confirms then carry on, 
		//	otherwise prevent the event from bubbling further.
		function showConfirm(event, target_element, message){
			var confirmed = window.confirm(message);
			if (!confirmed) event.stopImmediatePropagation();
		};
	};
})(jQuery);

//TODO: remove this later...
function trace(msg){try{console.log(msg)}catch(ex){}};