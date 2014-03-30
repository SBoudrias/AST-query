var assert = require('assert');
var program = require('..');
var Body = require('../lib/nodes/Body');

describe('Tree', function () {
  describe('#toString()', function () {
    it('return the generated source code', function () {
      var tree = program('var a = 1');
      assert.equal(tree.toString(), 'var a = 1;');
    });
  });

  describe('#body', function () {
    it('is a Body node instance', function () {
      var tree = program('var a = 1');
      assert(tree.body instanceof Body);
    });
  });
});
