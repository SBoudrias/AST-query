var assert = require('assert');
var valueFactory = require('../../lib/factory/value.js');

var ObjectExpression = require('../../lib/nodes/ObjectExpression.js');
var Literal = require('../../lib/nodes/Literal.js');

describe('ObjectExpression objects', function () {
  beforeEach(function () {
    this.obj = new ObjectExpression(valueFactory.create('{ a: "b", foo: 1, bar: { sub: 1 } }'));
  });

  it('#type equal ObjectExpression', function () {
    assert.equal(this.obj.type, 'ObjectExpression');
  });

  describe('#key()', function () {
    it('get key value', function () {
      assert.equal(this.obj.key('a').value(), 'b');
    });

    it('returns a wrapped value', function () {
      assert(this.obj.key('a') instanceof Literal);
      assert(this.obj.key('bar') instanceof ObjectExpression);
      assert(this.obj.key('bar').key('sub') instanceof Literal);
    });
  });
});
