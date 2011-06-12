describe('ConfirmIt', function() {
	describe('Initialization Suite', function() {
		var testbed;
		var test_element;
		
		beforeEach(function(){
			testbed = $("#test1");
			testbed.empty();
			testbed.append("<div id='init-test'>Test</div>");
			test_element = $("#init-test");
			test_element.click(function(){alert("clicked me!")});
		});
		
		it('Should have "data-confirmit-ready" data attribute set to true.', function() {
			test_element.confirmIt();
			expect(test_element).toHaveData("data-confirmit-ready", true);
		});
		
		it('Should have the "DOMNodeInserted" Confirmit event bound when "live" is set.', function() {
			test_element.confirmIt({'live':true});
			var events = $('body').data('events');
			var event = events['DOMNodeInserted'];
			expect(event).toBeDefined();
		});
	});
	
	describe('Post Destroy Suite', function() {
		var testbed;
		var test_element;
		
		beforeEach(function(){
			testbed = $("#test2");
			testbed.empty();
			testbed.append("<div id='destroy-test'>Test</div>");
			test_element = $("#destroy-test");
			test_element.click(function(){alert("clicked me!")});
		});
		
		it('Should not have "data-confirmit-ready" data attribute.', function() {
			test_element.confirmIt();
			test_element.confirmIt('destroy');
			expect(test_element).not.toHaveData("data-confirmit-ready");
		});
		
		it('Should not have the "triggered_by" Confirmit event bound.', function() {
			test_element.confirmIt();
			test_element.confirmIt('destroy');
			var events = test_element.data('events');
			console.log(events);
			var event = events['click.confirmit'];
			expect(event).not.toBeDefined();
		});
		
		it('Should not have the "DOMNodeInserted" Confirmit event bound when "live" is set.', function() {
			test_element.confirmIt({'live':true});
			test_element.confirmIt('destroy');
			var events = $('body').data('events');
			var event = events['DOMNodeInserted.confirmit'];
			expect(event).not.toBeDefined();
		});
	});
});