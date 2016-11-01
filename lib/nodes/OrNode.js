var   Class         = require('ee-class')
    , CompoundNode  = require('./CompoundNode');

var OrNode = module.exports = new Class({

      kind       : 'OrNode'
    , inherits   : CompoundNode

    , accept: function(visitor){
        return visitor.visitOrNode(this);
    }
});