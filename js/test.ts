// Javascript Custom
(function() {

	// Triger custom event
	var $filter: any = document.querySelector('.filterjs');
	$filter.addEventListener('changeafter', function() {
		console.log('changeAfter event');
	});
})();