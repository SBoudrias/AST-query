var expect = require("chai").expect;
var Tree = require("../../../lib/tree");

describe("array modification API", function() {
  it("should select array assigned to a variable", function() {
    var src = "var foo = ['foo'];";
    var tree = new Tree(src);
    tree.array().assignedTo("foo");
    tree.action = function( node ) {
      expect(node.source()).to.equal("['foo']");
    };
    tree.toString();
  });

  it("should select array passed to a function", function() {
    var src = "foo(['doe']);";
    var tree = new Tree(src);
    tree.array().passedTo("foo");
    tree.action = function( node ) {
      expect(node.source()).to.equal("['doe']");
    };
    tree.toString();
  });

  it("should select array passed to a method", function() {
    var src = "grunt.init(['john']);";
    var tree = new Tree(src);
    tree.array().passedTo("grunt.init");
    tree.action = function( node ) {
      expect(node.source()).to.equal("['john']");
    };
    tree.toString();
  });

  it("should push an item at the end of an array", function() {
    var tree = new Tree("var a = ['bar'];");
    tree.array().push("'foo'");
    expect(tree.toString()).to.equal("var a = ['bar', 'foo'];");
  });

  it("should push an item in an empty array", function() {
    var tree = new Tree("var a = [];");
    tree.array().push("'foo'");
    expect(tree.toString()).to.equal("var a = ['foo'];");
  });

  it("should unshift an item at the beginning of an array", function() {
    var tree = new Tree("var a = ['bar'];");
    tree.array().unshift("'foo'");
    expect(tree.toString()).to.equal("var a = ['foo', 'bar'];");
  });

  it("should unshift an item at the beginning of an empty array", function() {
    var tree = new Tree("var a = [];");
    tree.array().unshift("'foo'");
    expect(tree.toString()).to.equal("var a = ['foo'];");
  });

  it("should pop an element the end of an array", function() {
    var tree = new Tree("var a = ['bar', 'foo'];");
    tree.array().pop();
    expect(tree.toString()).to.equal("var a = ['bar'];");
  });
});
