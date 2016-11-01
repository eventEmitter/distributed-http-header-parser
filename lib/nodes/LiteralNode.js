var   Class   = require('ee-class')
    , ASTNode = require('./ASTNode');

/**
 * The basic literal values.
 * Everything that has no child nodes.
 *
 * 1. null
 * 2. true
 * 3. false
 * 4. number
 * 5. string
 * 6. date
 */
var LiteralNode = module.exports = new Class({

      value     : null
    , kind      : 'LiteralNode'
    , inherits  : ASTNode

    , init: function init (value,  parent){
        init.super.call(this, parent);
        this.value      = value;
    }

    , getValue : function(){
        return this.value;
    }

    , setValue : function(value){
        this.value = value;
        return this;
    }

    , accept        : function(visitor){
        return visitor.visitLiteralNode(this);
    }

    , toString      : function(){
        return this.getValue() === null ? 'null' : this.getValue().toString();
    }
});