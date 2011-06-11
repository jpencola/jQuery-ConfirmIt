describe('ConfirmIt', function() {
	describe('Initialization Suite', function() {
		it('Should have "data-confirmit-ready" data attribute set to true', function() {
			$("#test1").confirmIt();
			expect($('#test1')).toHaveData("data-confirmit-ready", true);
		});
	});
	describe('Destroy Suite', function() {
		it('Should not have "data-confirmit-ready" data attribute', function() {
			$("#test2").confirmIt();
			$("#test2").confirmIt('destroy');
			expect($('#test2')).not.toHaveData("data-confirmit-ready");
		});
	});
});