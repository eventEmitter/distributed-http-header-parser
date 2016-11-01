var Class           = require('ee-class'),
    AndNode    = require('../AndNode');

/**
 * Filter statements schould be an and collection (or as soon as supported).
 */
var FilterStatement = module.exports = new Class({
      kind      : "FilterStatement"
    , inherits  : AndNode
    , accept    : function(visitor){
        return visitor.visitFilterStatement(this);
    }

    , addToParent(node){
        this.getChildren().forEach((child)=>{ child.addToParent(node); });
        return this;
    }
});