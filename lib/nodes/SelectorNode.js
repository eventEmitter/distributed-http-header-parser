var   Class   = require('ee-class')
    , log     = require('ee-log')
    , NamedNode = require('./NamedNode')
    , NamedCollection = require('./collections/NamedCollection');

/**
 * Wrapper node which binds identifiers to children.
 * @type {*|exports|module.exports}
 */
var SelectorNode = module.exports = new Class({

      kind          : "Selector"
    , inherits      : NamedNode
    , alias         : null
    , comparison    : null
    , order         : null

    , init: function init(identifier, children, parent){
        init.super.call(this, identifier, children, parent);
        this.alias      = null;
        this.comparison = null;
        this.order      = null;
    }

    , isAlias: function(){
        return this.hasAlias();
    }

    , hasAlias: function(){
        return this.alias !== null;
    }

    , getAlias: function(){
        return this.alias;
    }

    , setAlias: function(alias){
        this.alias = alias;
        return this;
    }

    , hasComparison : function(){
        return this.comparison !== null;
    }

    , setComparison : function(comparison){
        comparison.setParent(this);
        this.comparison = comparison;
        return this;
    }

    , getComparison : function(){
        return this.comparison;
    }

    , hasOrder:function(){
        return this.order !== null;
    }

    , getOrder: function(){
        return this.order;
    }

    , setOrder: function(order){
        order.setParent(this);
        this.order = order;
        return this;
    }

    , accept: function(visitor){
        return visitor.visitSelectorNode(this);
    }

    , merge : function(node) {

        if(node.hasChildren()){
            node.getChildren().forEach((child)=>{ child.addToParent(this);  });
        }

        if(node.hasOrdering()){
            this.setOrdering(node.getOrdering());
        }
        if(node.hasComparison()){
            this.setComparison(node.getComparison());
        }
        if(node.isAlias()){
            this.setAlias(node.getAlias());
        }
        return this;
    }
});