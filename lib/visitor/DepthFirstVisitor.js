var Class = require('ee-class');

var DepthFirstVisitor = module.exports = new Class({

     visitNamedNode: function(node){
        return node;
    }

    , visitValueNode: function(node){
        return node;
    }

    , visitActionNode: function(node){
        return node;
    }

    , visitComparisonNode: function(node){
        return [
              node.property.accept(this)
            , node.operator
            , node.value
        ];
    }

    , visitSelectItem: function(node){

    }

    , visitFilterStatement: function(node){
        return this.visitNodeCollection(node);
    }

    , visitSelectStatement: function(node){
        return this.visitNodeCollection(node);
    }

    , visitNodeCollection: function(node){
        return node.map(function(child){
            child.accept(this);
        });
    }
});