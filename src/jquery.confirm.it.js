
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
				var settings = {
					triggered_by: "click",
					message: "Are you sure?",
					live: false
				};
				//	apply any overrides to the settings
				if (options) $.extend(settings, options);
				
				//	listen for future (live) elements added to the DOM 
				if (settings.live){
					$('body').bind('DOMNodeInserted.confirmit', function(event){$(event.target).confirmIt('init', options)});
				}
				
				var element = $(this);
				var is_already_initialized = !!(element.data('data-confirmit-ready')); 
				if (is_already_initialized) return;
				
				var events_data = element.data('events');
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
				} else {
					bindConfirmHandler(element);
				}
				
				//	stashes existing trigger events for re-use later
				function rememberEventHandlers(element, event_memory){
					var events = element.data('events');
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
					element.data('data-confirmit-deferred-callbacks', event_memory);
				};
				
				//	un-binds trigger events from the element
				function removeEventHandlers(element){
					element.unbind(settings.triggered_by);
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
				//	finally, fall back on the default message in settings
				function getConfirmMessage(element){
					var confirm_message, classname = element.attr('class');
					confirm_message = element.attr('data-confirmit-message');
					if (!confirm_message) try {confirm_message = classname.substring(classname.indexOf("{")+1, classname.lastIndexOf("}")).split(":")[1]} catch(ex){}; // good candidate for a regexp
					if (!confirm_message) confirm_message = settings.message;
					return confirm_message;
				};
				
				//	binds the confirm handler to the specified trigger event
				function bindConfirmHandler(element){
					element.data('data-confirmit-ready', true);
					element.bind(settings.triggered_by + '.confirmit', (function(e){showConfirm(e, element, getConfirmMessage(element))}));
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
		initleave: function(options){
				//console.log('initLeave');
				var element = $(this);
				var is_already_initialized = !!(element.data('data-confirmit-ready')); 
				if (is_already_initialized) return;
				
				element.data('altered',false);
				//the actual leave page event
				function confirmExit(event) {  
					//if the form has been not been altered
					console.log("confirmExit() element.data('altered') = " + element.data('altered'));
					
					if (element.data('altered') == false)
					{  
					//cancel the event and leave the page
						event.cancelBubble = true;  
					}  
					else  
					{ 
						//else pop up the confirm message
						return options.message;  
					}
				}
				
				window.onbeforeunload = confirmExit; 
				
				element.find("textarea, select, :text, checkbox,:radio, :password,:input[type='textarea'], :input[type='password'], :input[type='radio'], :input[type='checkbox'], :input[type='file']").change(function(){
					element.data('altered',true);
				});
				
				element.find("textarea, :text").keydown(function(){
					element.data('altered',true);
				});
				element.find(":submit").click(function(){
					element.data('altered',false);
				});
		
	            element.data('data-confirmit-unload', true);
	            element.data('data-confirmit-ready', true);
			return this;
		},
		destroy: function(){
			//console.log("destroy");
		
			return this.each(function(){
				var element = $(this);
				if(element.data('data-confirmit-unload'))
				{
					element.removeData('data-confirmit-unload');
					element.removeData('altered');
					window.onbeforeunload = null;
				}
	            element.unbind('.confirmit');
	            element.removeData('data-confirmit-ready');
	            element.removeData('data-confirmit-deferred-callbacks');
			});
		}
	};
	
	$.fn.confirmIt = function(method){
		//console.log('confirmIt');
		if (methods[method]){
			console.log("calling methods[method].apply");
			return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
		} else if (typeof method === 'object' || !method){			
			if(!!method && !!method.triggered_by && method.triggered_by == 'unload'){					
				//console.log('enter initleave');
				return methods.initleave.apply(this, arguments);
			}							
			//console.log('enter init');
			return methods.init.apply(this, arguments);
		} else if (typeof method === 'string'){
			//pass in a message string instead of an object with a message property
			$(this).confirmIt({message:method});
		}else{
			$.error( 'Method ' +  method + ' does not exist on jQuery.confirmit' );
		}
	};
})(jQuery);
