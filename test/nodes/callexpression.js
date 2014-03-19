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
    assert.equal(this.tree1.callExpression('foo').length, 1);
  });

  it('selects method call', function () {
    assert.equal(this.tree2.callExpression('bar.foo').length, 1);
    assert.equal(this.tree3.callExpression('bar.doe.foo').length, 1);
  });

  describe('#arguments', function () {
    describe('#push()', function () {
      it('add argument to the end', function () {
        this.tree1.callExpression('foo').arguments.push('["a"]');
        assert.equal(this.tree1.toString(), 'foo(1, [\'a\']);');
      });
    });

    describe('#unshift()', function () {
      it('add argument to the start', function () {
        this.tree1.callExpression('foo').arguments.unshift('2');
        assert.equal(this.tree1.toString(), 'foo(2, 1);');
      });
    });

    describe('#get()', function () {
      it('returns argument at given index', function () {
        var tree = new Tree('foo(1, { a : "b" }, "foo", b);');
        assert.equal(tree.callExpression('foo').arguments.get(0).value, 1);
        assert.equal(tree.callExpression('foo').arguments.get(2).value, 'foo');
      });
    });
  });
});
