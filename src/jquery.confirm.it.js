var ConfirmIt = (function(){
	var instances = [];
	var create = function(options){
		var element = $(this);
		var _instance = (function(){
			var already_exists = !!(element.data('data-confirmit-ready')); 
			if (already_exists) return;
			
			var defaults  = {
				triggered_by: "click",
				message: "Are you sure?",
				live: false
			};
			
			var properties = $.extend({}, properties, defaults);
			$.extend(properties, options);
			
			function init(){
				//	store an index of the new ConfirmIt object for lookups later
				element.data('data-confirmit-index', ConfirmIt.instances.length);
				
				//	listen for future (live) elements added to the DOM 
				if (properties.live){
					$('body').bind('DOMNodeInserted.confirmit', function(event){$(event.target).confirmIt('init', options)});
				}

				//	if the trigger is "onbeforeunload" then we assume that the implementor wants 
				//	to confirm a form that may contain client-side changes.
				if (properties.triggered_by === 'unload'){	
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
				
				var events = element.data('events');
				var hasEvents = !!events;
				var hasTriggerEvent = (function(){
					try{return !!events[defaults.triggered_by]}
					catch(ex){return false}})();
				if (hasEvents && hasTriggerEvent){
					var trigger_events = events[properties.triggered_by];
					var event_memory = [];
					for (var event in trigger_events){
						rememberEventHandlers(element, event_memory);
						detachEventHandlers(element);
						bindConfirmHandler(element);
						reattachEventHandlers(element);
					}
				} else {
					bindConfirmHandler(element);
				}
				
				//	stash existing trigger events for re-use later
				function rememberEventHandlers(element, event_memory){
					for (var event in events){
						for (var i=0, count=events[event].length; i<count; i++){
							var event_object = events[event][i];
							if (event_object.type == properties.triggered_by){
								event_memory.push({
									type: event_object.type,
									handler: event_object.handler
								});
							}
						}
					}
					element.data('data-confirmit-deferred-callbacks', event_memory);
				};
				
				//	detaches trigger events from the element
				function detachEventHandlers(element){
					element.unbind(properties.triggered_by);
				};
				
				//	re-attaches trigger events to the element
				function reattachEventHandlers(element){
					var events = element.data('data-confirmit-deferred-callbacks');
					for (var event in events){
						var event_type = events[event].type;
						var event_handler = events[event].handler;
						element.bind(event_type, event_handler);
					}
				};

				//	Extracts the confirmation message from the element 
				//	HTML5 data attribute is preferred...
				//	then the class attribute...
				//	finally, fall back on the default message in properties
				function getConfirmMessage(element){
					var confirm_message, classname = element.attr('class');
					confirm_message = element.attr('data-confirmit-message');

					if (!confirm_message) 
						try {confirm_message = classname.substring(classname.indexOf("{")+1, classname.lastIndexOf("}")).split(":")[1]} 
						catch(ex){}; // good candidate for a regexp
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
							return properties.message;  
						}
					};
					window.onbeforeunload = confirmIfChanged;
				};
				
				//	binds the confirm handler to the specified trigger event
				function bindConfirmHandler(element){
					element.data('data-confirmit-ready', true);
					element.bind(properties.triggered_by + '.confirmit', (function(e){showConfirm(e, element, getConfirmMessage(element))}));
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
			}
			
			init();
			
			return {
				defaults: defaults,
				options: options,
				properties: properties,
				init: init,
				destroy: destroy
			}
		})();
		instances.push(_instance);
		return _instance;	
	};
	
	var destroy = function(){
		var element = $(this);
		if (element.data('data-confirmit-triggered-by-unload')){
			element.removeData('data-confirmit-triggered-by-unload');
			element.removeData('data-confirmit-altered');
			window.onbeforeunload = null;
			
		} else {
			element.unbind('.confirmit');
			element.removeData('data-confirmit-deferred-callbacks');
		}
		var index = element.data('data-confirmit-index');
		ConfirmIt.instances[index] = null;
		element.removeData('data-confirmit-ready');
		element.removeData('data-confirmit-index');
	};
	
	return { 
		instances: instances,
		create: create,
		destroy: destroy
	}
})();
			
(function($){
	var methods = {
		init: function(options){
			return this.each(function(){
				ConfirmIt.create.call(this, options);
			});
		},
		destroy: function(){
			return this.each(function(){
				ConfirmIt.destroy.call(this);
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