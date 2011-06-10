
(function($){
	var methods = {
		init: function(options){
			//	for each matching element that needs a confirmation step...
			//	iterate over all events that it has currently bound
			//	find the events that match the triggered_by name
			//	store them for retrieval later
			//	un-bind all of them
			//	bind the confirm event so it is the first one in the bubbling phase
			//	re-bind all the other events
			return this.each(function(){
				var defaults = {
					triggered_by: "click",
					message: "Are you sure?",
					live: false
				};
				//	apply any overrides to the defaults
				if (options) $.extend(defaults, options);
				
				//	listen for future (live) elements added to the DOM 
				if (defaults.live){
					$('body').bind('DOMNodeInserted.confirmit', function(event){$(event.target).confirmIt('init', options)});
				}
				
				var element = $(this);
				var is_already_initialized = !!(element.data('data-confirmit-ready')); 
				if (is_already_initialized) return;
				
				//	if the trigger is "beforeunload" then we assume that the user is 
				//	trying to confirm a form that hasn't been submitted with changes
				if (defaults.triggered_by === 'unload'){		
					bindFormConfirmHandler(element);
					
					element.find("textarea, select, :text, checkbox,:radio, :password,:input[type='textarea'], :input[type='password'], :input[type='radio'], :input[type='checkbox'], :input[type='file']").change(function(){
						element.data('data-confirmit-altered',true);
					});
					
					element.find("textarea, :text").keydown(function(){
						element.data('data-confirmit-altered',true);
					});
					element.find(":submit").click(function(){
						element.data('data-confirmit-altered',false);
					});
					
		            element.data('data-confirmit-triggered-by-unload', true);
		            element.data('data-confirmit-ready', true);
		            return;
				}
				
				var events_data = element.data('events');
				var hasEvents = !!events_data;
				var hasTriggerEvent = (function(){try{return !!events_data[defaults.triggered_by]}catch(ex){return false}})();
				if (hasEvents && hasTriggerEvent){
					var trigger_events = events_data[defaults.triggered_by];
					var event_memory = [];
					for (var event in trigger_events){
						rememberEventHandlers(element, event_memory);
						removeEventHandlers(element);
						bindConfirmHandler(element);
						restoreEventHandlers(element);
					}
				} else {
					bindConfirmHandler(element);
				}
				
				//	stashes existing trigger events for re-use later
				function rememberEventHandlers(element, event_memory){
					var events = element.data('events');
					for (var event in events){
						for (var i=0, count=events[event].length; i<count; i++){
							var event_object = events[event][i];
							if (event_object.type == defaults.triggered_by){
								event_memory.push({
									type: event_object.type,
									handler: event_object.handler
								});
							}
						}
					}
					element.data('data-confirmit-deferred-callbacks', event_memory);
				};
				
				//	un-binds trigger events from the element
				function removeEventHandlers(element){
					element.unbind(defaults.triggered_by);
				};
				
				//	re-binds pre-existing trigger events to the element
				function restoreEventHandlers(element){
					var events = element.data('data-confirmit-deferred-callbacks');
					for (var event in events){
						var event_type = events[event].type;
						var event_handler = events[event].handler;
						element.bind(event_type, event_handler);
					}
				};

				//	Extracts the confirmation message from the element 
				//	HTML5 data attribute is prefferred...
				//	then the class attribute...
				//	finally, fall back on the default message in defaults
				function getConfirmMessage(element){
					var confirm_message, classname = element.attr('class');
					confirm_message = element.attr('data-confirmit-message');
					if (!confirm_message) try {confirm_message = classname.substring(classname.indexOf("{")+1, classname.lastIndexOf("}")).split(":")[1]} catch(ex){}; // good candidate for a regexp
					if (!confirm_message) confirm_message = defaults.message;
					return confirm_message;
				};
				
				//	binds the confirm leave handler on the window object
				function bindFormConfirmHandler(element){
					var confirmIfChanged = function(event){  
						//	if the form has been not been altered
						if (!element.data('data-confirmit-altered')){  
							//	cancel the event and leave the page
							event.cancelBubble = true;  
						} else { 
							//	else pop up the confirm message
							return defaults.message;  
						}
					};
					window.onbeforeunload = confirmIfChanged;
				};
				
				//	binds the confirm handler to the specified trigger event
				function bindConfirmHandler(element){
					element.data('data-confirmit-ready', true);
					element.bind(defaults.triggered_by + '.confirmit', (function(e){showConfirm(e, element, getConfirmMessage(element))}));
				};
				
				//	Display a confirm dialog
				//	If the user declines then first stop any further bubbling of the event
				//	then, if the element is an Anchor, prevent it's default behavior.
				function showConfirm(event, target_element, message){
					var confirmed = window.confirm(message);
					if (!confirmed){
						event.stopImmediatePropagation();
						var is_anchor_element = !!(event.target.nodeName === 'A');
						if (is_anchor_element) event.preventDefault();
					}
				};
			});
		},
		destroy: function(){
			return this.each(function(){
				var element = $(this);
				if (element.data('data-confirmit-triggered-by-unload')){
					element.removeData('data-confirmit-triggered-by-unload');
					element.removeData('data-confirmit-altered');
					window.onbeforeunload = null;
				} else {
					element.unbind('.confirmit');
					element.removeData('data-confirmit-deferred-callbacks');
				}
	            element.removeData('data-confirmit-ready');
			});
		}
	};
	
	$.fn.confirmIt = function(method){
		if (methods[method])
			return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
		if (typeof method === 'string')
			method ={message:method};
		return methods.init.apply(this, arguments);
	};
})(jQuery);