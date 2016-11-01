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
var ComparisonNode = module.exports = new Class({

      kind          : 'Comparison'
    , inherits      : ASTNode

    , comparator    : null
    , comparison    : null

    , init: function init (comparator, comparison, parent){
        init.super.call(this, parent);
        this.comparator = comparator;
        this.comparison = comparison;
    }

    , getComparator : function() {
        return this.comparator;
    }

    , setComparator : function() {
        this.comparator = comparator;
        return this;
    }

    , getComparison : function(){
        return this.comparison;
    }

    , setComparison : function(node){
        node.setParent(this);
        this.comparison = node;
        return this;
    }
});