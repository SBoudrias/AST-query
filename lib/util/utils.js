/**
 * Match a MemberExpression node against a name.
 * @param  {String} name Name of the expected member expression (e.g. `foo.bar`)
 * @param  {Object} node Exprima node
 * @return {Boolean}     Does the node match the name
 */
exports.matchMemberExpression = function (name, node) {
  var nameParts = name.split('.');

  if (node.type !== 'MemberExpression' || node.property.name !== nameParts[nameParts.length - 1]) {
    return false;
  }

  function match(node, index) {
    if (node.type === 'MemberExpression') {
      if (node.property.name !== nameParts[index]) return false;
      return match(node.object, --index);
    }
    if (node.type === 'Identifier' && node.name === nameParts[index] && index === 0) {
      return true;
    }
  }
  return match(node.object, nameParts.length - 2);
};

function mixin(destination, source) {
  if (source) {
    for (var key in source) {
      if (typeof source[key] === 'object') {
        if (typeof destination[key] === 'object') {
          mixin(destination[key], source[key]);
        }
        else {
          destination[key] = mixin({}, source[key]);
        }
      }
      else if (destination[key] !== source[key]) {
        destination[key] = source[key];
      }
    }
  }
  return destination;
}

exports.mixin = function (destination) {
  var args = Array.prototype.slice.call(arguments, 1);
  for (var i = 0; i < args.length; i++) {
    mixin(destination, args[i]);
  }

  return destination;
};
