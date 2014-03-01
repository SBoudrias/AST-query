var esprima = require('esprima');

exports.create = function (valStr) {
  var tree = esprima.parse('var astValFactory = ' + valStr);
  return tree.body[0].declarations[0].init;
};
