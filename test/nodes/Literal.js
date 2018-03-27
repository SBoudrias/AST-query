var assert = require('assert');
var valueFactory = require('../../lib/factory/value.js');

var Literal = require('../../lib/nodes/Literal.js');

var Tree = require('../..');

[
  Tree.fromSource,
  function() {
    var tree = Tree.fromSource(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    return Tree.fromTree(tree.tree, arguments[1], arguments[2], arguments[3], arguments[4]);
  },
].forEach(function(program) {
  describe('Literal nodes', function () {
    beforeEach(function () {
      this.tree = program('var a = 2;');
    });

    describe('#value', function () {
      it('overwrite value', function () {
        var literal = this.tree.var('a').value();
        literal.value('{ a: 2 }');
        assert.equal(this.tree.toString(), 'var a = { a: 2 };');
      });
    });
  });
});
