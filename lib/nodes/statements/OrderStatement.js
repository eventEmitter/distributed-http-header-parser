var Class           = require('ee-class'),
    Collection  = require('../collections/Collection');

/**
 * Represents a select statement, the only sense is to make the context available to the visitor.
 */
var OrderStatement = module.exports = new Class({
      _type     : "OrderStatement"
    , inherits  : Collection
    , accept: function(visitor){
        return visitor.visitOrderStatement(this);
    }
});