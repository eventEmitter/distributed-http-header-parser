var   Class         = require('ee-class')
    , CompoundNode  = require('./CompoundNode');

var ArrayNode = module.exports = new Class({

      kind       : 'ArrayNode'
    , inherits   : CompoundNode

    , accept: function(visitor){
        return visitor.visitArrayNode(this);
    }
});