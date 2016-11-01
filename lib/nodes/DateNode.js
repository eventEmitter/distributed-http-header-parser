var   Class   = require('ee-class')
    , log     = require('ee-log')
    , LiteralNode = require('./LiteralNode');

/**
 * Wrapper node which binds identifiers to children.
 * @type {*|exports|module.exports}
 */
var DateNode = module.exports = new Class({

      kind          : "Date"
    , inherits      : LiteralNode

    , accept : function(visitor){
        return visitor.visitDateNode(this);
    }
});