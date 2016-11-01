var   Class   = require('ee-class')
    , log     = require('ee-log')
    , NamedNode = require('./NamedNode');

/**
 * Wrapper node which binds identifiers to children.
 * @type {*|exports|module.exports}
 */
var FunctionNode = module.exports = new Class({

      kind          : "FunctionNode"
    , inherits      : NamedNode

    , init: function init(identifier, parameters){
        init.super.call(this, identifier, parameters);
    }

    , accept: function(visitor){
        return visitor.visitFunctionNode(this);
    }

});