var   Class             = require('ee-class')
    , log               = require('ee-log')
    , AndNode           = require('../AndNode');

/**
 * Represents a select statement, the only sense is to make the context available to the visitor.
 */
var SelectStatement = module.exports = new Class({

      kind      : "SelectStatement"
    , inherits  : AndNode

    , init : function init(items){
        init.super.call(this, items);
    }

    , accept: function(visitor){
        return visitor.visitSelectStatement(this);
    }

    , addToParent: function(parent){
        // @todo: copy the children
        this.getChildren().forEach((child) => { child.addToParent(parent); });
        return this;
    }

    , flatten: function(){
        return this.reduce(function(result, item){
            return result.concat(item.flatten());
        }, []);
    }
});