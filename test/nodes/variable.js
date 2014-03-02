/*globals describe, it, beforeEach */
var assert = require('assert');
var Tree = require('../..');

describe('Variable objects', function () {
  beforeEach(function () {
    this.tree1 = new Tree('var a = 1;');
    this.tree2 = new Tree('var a = 1, b = 1;');
    this.tree3 = new Tree('var a = 1; (function () { var a = 2; }());');
  });

  it('selects variables', function () {
    assert.equal(this.tree1.var('a').length, 1);
    assert.equal(this.tree3.var('a').length, 2);
  });

  describe('#value()', function () {
    it('update value', function () {
      this.tree1.var('a').value('3');
      assert.equal(this.tree1.toString(), 'var a = 3;');
    });

    it('update value when multiple declared var in a single block', function () {
      this.tree2.var('b').value('3');
      assert.equal(this.tree2.toString(), 'var a = 1, b = 3;');
    });

    it('update value of every matching variable', function () {
      this.tree3.var('a').value('3');
      assert.equal(this.tree3.toString(), 'var a = 3;\n(function () {\n    var a = 3;\n}());');
    });

    it('return the value');

    it('return the first matched variable value');
  });
});
