var helpers = module.exports = {};

helpers.unbox = function( arr, methodName ) {
	return function() {
		var args = arguments;
		arr.forEach(function( el ) {
			el[methodName].apply( el, args );
		});
	};
};