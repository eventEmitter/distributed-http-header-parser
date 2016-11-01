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
    , ordering      : null

    , init: function init(identifier, children, parent){
        init.super.call(this, identifier, children, parent);
        this.alias      = null;
        this.comparison = null;
        this.ordering   = null;
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

    , hasOrdering:function(){
        return this.ordering !== null;
    }

    , getOrdering: function(){
        return this.ordering;
    }

    , setOrdering: function(ordering){
        this.ordering = ordering;
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