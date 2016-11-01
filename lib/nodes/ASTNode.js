var   Class         = require('ee-class')
    , Collection    = require('./collections/Collection');
/**
 * The basic tree node.
 */
var ASTNode = module.exports = new Class({

      parent    : null
    , kind      : 'ASTNode'

    , init: function(parent){
        this.parent     = parent || null;
        // Ensure that the kind is visible for debugging
        this.kind       = this.kind;
    }

    , hasParent : function(){
        return this.parent !== null;
    }

    , setParent: function(parentNode){
        this.parent = parentNode;
        return this;
    }

    , getParent: function(){
        return this.parent;
    }

    , addToParent : function(parent){
        this.setParent(parent);
        parent.addChild(this);
        return this;
    }

    , getChildren : function(){ return []; }
    , hasChildren : function(){ return false; }
    , setChildren : function(collectionOfNodes){ return this; }
    , addChild    : function(child){ return this; }
    , getChildAt : function(index){ return this.getChildren()[index]; }

    /**
     * Returns all children which are leaf nodes (i.e. don't have children).
     * @returns []
     */
    , getLeafNodes : function(){
        if(!this.hasChildren()) return [ this ];
        return this.getChildren().reduce(function(previous, node){
            return previous.concat(node.getLeafNodes());
        }, []);
    }
    /**
     * Accept method establishing a double dispatch for the usage with visitors.
     *
     * @param visitor
     * @returns {*}
     */
    , accept : function(visitor){ return visitor.visitAstNode(this); }
});