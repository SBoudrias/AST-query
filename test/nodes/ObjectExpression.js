var assert = require('assert');
var valueFactory = require('../../lib/factory/value.js');
var ObjectExpression = require('../../lib/nodes/ObjectExpression.js');

describe('ObjectExpression objects', function () {
  beforeEach(function () {
    this.obj = new ObjectExpression(valueFactory.create('{ a: "b", foo: 1, bar: { sub: 1 } }'));
  });

  it('#type equal ObjectExpression', function () {
    assert.equal(this.obj.type, 'ObjectExpression');
  });

  describe('#key()', function () {
    it('get key value', function () {
      assert.equal(this.obj.key('a').value, 'b');
    });
  });
});
