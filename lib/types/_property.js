var helpers = require("../helpers");

/**
 * Create an object token
 * @constructor
 * @param {String} name The key name
 */
function Property( name ) {
  this.name = name;
  this.action = function() {};
}

module.exports = Property;

/**
 * Standard run function used when tokens are applied.
 * @param  {AST node} node
 * @return {null}
 */
Property.prototype.use = function( node ) {
  if ( node.type === "Property" && node.key.name === this.name ) {
    this.action( node );
  }
};


/**
 * Change the property value
 * @param  {String} value  New value string
 * @return {null}
 */
Property.prototype.value = function( value ) {
  this.action = function( node ) {
    if ( typeof value === "function" ) {
      value = value( node.value ? node.value.source() : undefined );
    }
    node.value.update( value );
  };
};

/**
 * Rename the property
 * @param  {string} name  New property name
 * @return {null}
 */
Property.prototype.rename = function( name ) {
  this.action = function( node ) {
    node.key.update( name );
  };
};

/**
 * Delete the property.
 * @return {null}
 */
Property.prototype.delete = function() {
  this.action = function( node ) {
    node.update("");
    helpers.removeExtraComma( node.parent );
  };
};

/**
 * Select a key if the property is an object
 * @param {String} name Key name
 * @return {null}
 */
Property.prototype.key = function( name ) {
  var key = new Property( name );
  this.action = function( node ) {
    if ( node.value.type !== "ObjectExpression" ) return;
    node.value.properties.forEach(function( property ) {
      key.use( property );
    });
  };
  return key;
};
