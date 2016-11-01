var   Class   = require('ee-class')
    , log     = require('ee-log')
    , LiteralNode = require('./LiteralNode');

/**
 * Special Node for Identifiers.
 */
var IdentifierNode = module.exports = new Class({

      kind          : "Identifier"
    , inherits      : LiteralNode
    , name          : { get : function(){ return this.getValue(); }}

    , init: function init(value){
        init.super.call(this);
        this.value = value;
    }

    , getName : function(){
        return this.name;
    }

    , addToParent: function(parent){
        parent.setIdentifier(this);
    }

    , accept : function(visitor){
        return visitor.visitIdentifierNode(this);
    }

});