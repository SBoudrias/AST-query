'use strict';
var isRegExp = require('lodash.isregexp');

/**
 * Match a MemberExpression node against a name.
 * @param  {String} name Name of the expected member expression (e.g. `foo.bar`)
 * @param  {Object} node Esprima node
 * @return {Boolean}     Does the node match the name
 */
exports.matchMemberExpression = function (name, node) {
  if (isRegExp(name)) {
    return exports.matchRegexMemberExpression(name, node);
  }

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

/**
 * Matches a MemberExpression by traversing the node and returns true if any of the property names match.
 * @param nameRegex
 * @param node
 * @returns {Boolean}
 */
exports.matchRegexMemberExpression = function matchRegexMemberExpression(nameRegex, node) {
  if (!node) {
    return false;
  }

  if (node.type === 'MemberExpression') {
    if (nameRegex.test(node.property.name)) {
      return true;
    }

    return matchRegexMemberExpression(nameRegex, node.object);
  }

  if (node.type === 'Identifier' && nameRegex.test(nameRegex)) {
    return true;
  }

  return false;
};

/**
 * Matches a string to a possible regex.
 * @param {String|RegExp} toMatch
 * @param {String} other
 * @returns {Boolean}
 */
exports.match = function (toMatch, other) {
  if (isRegExp(toMatch)) {
    return toMatch.test(other);
  }

  return toMatch === other;
};
