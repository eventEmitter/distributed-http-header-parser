var Class   = require('ee-class');

/*
 * Currently just an intermediate class to represent sequences of nodes...
 * This is pretty much BS...
 */
var Collection = module.exports = new Class({

      inherits: Array
    , kind: "Collection"

    , init: function init (items){
        init.super.call(this);
        var elements = items || [];
        elements.forEach(function(element){
            this.addItem(element);
        }, this);
    }

    , addItem : function(item){
        this.push(item);
    }

    , getItem : function(key){
        var index = parseInt(key, 10);
        return this[index];
    }

    , hasItem : function(key){
        return this.length > parseInt(key, 10);
    }

    , accept: function(visitor) {
        return visitor.visitNodeCollection(this);
    }

    , addToParent : function(node){
        this.forEach(function(item){
            item.addToParent(node);
        });
    }
});