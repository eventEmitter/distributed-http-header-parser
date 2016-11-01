var   Class         = require('ee-class')
    , CompoundNode  = require('./CompoundNode');

var NamedNode = module.exports = new Class({

      identifier : null
    , kind       : 'NamedNode'
    , inherits   : CompoundNode
    , name       : { get: function(){ return this.getIdentifier().toString(); }}

    , init: function init(identifier, children, parent){
        init.super.call(this, children, parent);
        this.setIdentifier(identifier);
    }

    , getName: function(){
        return this.name;
    }

    , getIdentifier: function(){
        return this.identifier;
    }

    , setIdentifier: function(identifier){
        identifier.setParent(this);
        this.identifier = identifier;
        return this;
    }

    , accept: function(visitor){
        return visitor.visitNamedNode(this);
    }

    , toString: function(){
        return this.name;
    }
});