var helpers = module.exports = {};

helpers.unbox = function( arr, methodName ) {
	return function() {
		var args = arguments;
		arr.forEach(function( el ) {
			el[methodName].apply( el, args );
		});
	};
};

helpers.removeExtraComma = function( node ) {
	var src = node.source();
	src = src
		.replace(/(,)+/gi, ",") // comma following
		.replace(/(,)\s?;/gi, ";"); // endind comma
	node.update( src );
};