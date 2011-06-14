describe('ConfirmIt', function() {
	describe('Initialization Suite', function() {
		var testbed;
		var test_element;
		
		//	setup
		beforeEach(function(){
			testbed = $("#test1");
			testbed.append("<div id='init-test'>Test</div>");
			test_element = $("#init-test");
			test_element.click(function(){alert("clicked me!")});
		});
		
		//	tear-down
		afterEach(function(){
			test_element.confirmIt('destroy');
			testbed.empty();
			ConfirmIt.instances = [];
			delete test_element;
		})
		
		it('Should have "data-confirmit-ready" data attribute set to true.', function() {
			test_element.confirmIt();
			expect(test_element).toHaveData("data-confirmit-ready", true);
		});
		
		it('Should have "data-confirmit-index" data attribute set to 0.', function() {
			test_element.confirmIt();
			expect(test_element).toHaveData("data-confirmit-index", 0);
		});
		
		it('Should have the "DOMNodeInserted" Confirmit event bound when "live" is set.', function() {
			test_element.confirmIt({'live':true});
			var events = $('body').data('events');
			var event = events['DOMNodeInserted'];
			expect(event).toBeDefined();
		});
	});
	
	describe('Destroy Suite', function() {
		var testbed;
		var test_element;
		
		//	setup
		beforeEach(function(){
			testbed = $("#test2");
			testbed.empty();
			testbed.append("<div id='destroy-test'>Test</div>");
			test_element = $("#destroy-test");
			test_element.click(function(){alert("clicked me!")});
		});
		
		//	tear-down
		afterEach(function(){
			test_element.confirmIt('destroy');
			testbed.empty();
			ConfirmIt.instances = [];
			delete test_element;
		})
		
		it('Should not have "data-confirmit-ready" data attribute.', function() {
			test_element.confirmIt();
			test_element.confirmIt('destroy');
			expect(test_element).not.toHaveData("data-confirmit-ready");
		});
		
		it('Should not have "data-confirmit-index" data attribute.', function() {
			test_element.confirmIt();
			test_element.confirmIt('destroy');
			expect(test_element).not.toHaveData("data-confirmit-index");
		});
		
		it('Should not have the "triggered_by" Confirmit event bound.', function() {
			test_element.confirmIt();
			test_element.confirmIt('destroy');
			var events = test_element.data('events');
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