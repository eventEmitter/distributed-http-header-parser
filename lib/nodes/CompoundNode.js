var   Class         = require('ee-class')
    , ASTNode       = require('./ASTNode');

/**
 * The basic tree node.
 */
var CompoundNode = module.exports = new Class({

      kind     : 'CompoundNode'
    , inherits : ASTNode
    , length   : { get(){ return this.getChildren().length; }}

    , init: function init (children, parent){
        init.super.call(this, parent);
        this.setChildren(children || []);
    }

    , getChildren : function(){ return this.children; }
    , hasChildren : function(){ return this.getChildren().length > 0; }
    , setChildren : function(collectionOfNodes){
        this.children = [];
        collectionOfNodes.forEach(child => { this.addChild(child); });
        return this;
    }
    , addChild    : function(child){
        child.setParent(this);
        this.children.push(child);
    }

    , accept : function(visitor){ return visitor.visitCompoundNode(this); }
});