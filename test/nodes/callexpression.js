/*globals describe, it, beforeEach */
var assert = require('assert');
var Tree = require('../..');

describe('CallExpression objects', function () {
  beforeEach(function () {
    this.tree1 = new Tree('foo(1);');
    this.tree2 = new Tree('bar.foo();');
    this.tree3 = new Tree('bar.doe.foo();');
  });

  it('selects function call', function () {
    assert.equal(this.tree1.invocation('foo').length, 1);
  });

  it('selects method call', function () {
    assert.equal(this.tree2.invocation('bar.foo').length, 1);
    assert.equal(this.tree3.invocation('bar.doe.foo').length, 1);
  });

  describe('#pushArgument', function () {
    it('add argument to the end', function () {
      this.tree1.invocation('foo').pushArgument('["a"]');
      assert.equal(this.tree1.toString(), 'foo(1, [\'a\']);');
    });
  });

  describe('#unshiftArgument', function () {
    it('add argument to the start', function () {
      this.tree1.invocation('foo').unshiftArgument('2');
      assert.equal(this.tree1.toString(), 'foo(2, 1);');
    });
  });
});
