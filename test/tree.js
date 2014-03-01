var assert = require('assert');
var Tree = require('..');

describe('Tree', function () {
  describe('#toString()', function () {
    it('return the generated source code', function () {
      var tree = new Tree('var a = 1');
      assert.equal(tree.toString(), 'var a = 1;');
    });
  });
});
