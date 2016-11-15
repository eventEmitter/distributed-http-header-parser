var   Class             = require('ee-class')
    , log               = require('ee-log')
    , AndNode           = require('../AndNode');

/**
 * Represents a select statement, the only sense is to make the context available to the visitor.
 */
var OrderStatement = module.exports = new Class({

      kind      : "OrderStatement"
    , inherits  : AndNode

    , init : function init(items){
        init.super.call(this, items);
    }

    , accept: function(visitor){
        return visitor.visitOrderStatement(this);
    }
});