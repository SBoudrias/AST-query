var helpers = module.exports = {};

/**
 * Return a function which apply a method on an array objects passing down the arguments.
 * @param  {Array} arr         The array containing object
 * @param  {String} methodName Object method name to invoke
 * @return {Function}          A function who'll pass down the invocation arguments to
 *                             each objects method.
 */
helpers.unbox = function( arr, methodName ) {
  return function() {
    var args = arguments;
    arr.forEach(function( el ) {
      el[methodName].apply( el, args );
    });
  };
};

/**
 * Cleanup the comma after AST changes
 * @param  {AST Node} node  the node to cleanup
 * @return {null}
 */
helpers.removeExtraComma = function( node ) {
  var src = node.source();
  src = src
    .replace(/(,)+/gi, ",") // multiple comma
    .replace(/(var\s*)(,\s?)*/gi, "$1") // comma following a `var`
    .replace(/(,\s?)(\s*\})/gi, "$2") // comma ending an object literal
    .replace(/(\{\s*)(,\s?)/, "$1") // comma starting an object literal
    .replace(/(,)\s?;/gi, ";"); // ending comma
  node.update( src );
};
