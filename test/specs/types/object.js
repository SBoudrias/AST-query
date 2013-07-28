var expect = require("chai").expect;
var Tree = require("../../../lib/tree");

describe("object modification API", function() {

  it("should select object assigned to a variable", function() {
    var src = "var foo = { john : 'doe'};";
    var tree = new Tree(src);
    tree.object().assignedTo("foo");
    tree.action = function( node ) {
      expect(node.source()).to.equal("{ john : 'doe'}");
    };
    tree.toString();
  });

  it("should select object passed to a function", function() {
    var src = "foo({ john : 'doe'});";
    var tree = new Tree(src);
    tree.object().passedTo("foo");
    tree.action = function( node ) {
      expect(node.source()).to.equal("{ john : 'doe'}");
    };
    tree.toString();
  });

  it("should select object passed to a method", function() {
    var src = "grunt.init({ john : 'doe'});";
    var tree = new Tree(src);
    tree.object().passedTo("grunt.init");
    tree.action = function( node ) {
      expect(node.source()).to.equal("{ john : 'doe'}");
    };
    tree.toString();
  });

  describe("Property sub-object", function() {

    beforeEach(function() {
      this.src = "var a = { a: 'a', b: 'b' };";
      this.tree = new Tree( this.src );
    });

    it("should rename property key", function() {
      this.tree.object().key("a").rename("foo");
      expect(this.tree.toString()).to.equal("var a = { foo: 'a', b: 'b' };");
    });

    it("should change a property value", function() {
      this.tree.object().key("b").value("'foo'");
      expect(this.tree.toString()).to.equal("var a = { a: 'a', b: 'foo' };");
    });

    it("should delete a property", function() {
      this.tree.object().key("b").delete();
      expect(this.tree.toString()).to.equal("var a = { a: 'a' };");

      var tree = new Tree(this.src);
      tree.object().key("a").delete();
      expect(tree.toString()).to.equal("var a = { b: 'b' };");
    });

  });

});
