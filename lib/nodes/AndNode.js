var   Class         = require('ee-class')
    , CompoundNode  = require('./CompoundNode');

var AndNode = module.exports = new Class({

      kind       : 'AndNode'
    , inherits   : CompoundNode

    , init : function init(items, parent){
        init.super.call(this, items, parent);
    }

    , accept: function(visitor){
        return visitor.visitAndNode(this);
    }
});