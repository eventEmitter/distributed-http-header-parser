var   Class      = require('ee-class')
    , Types      = require('ee-types')
    , Collection = require('./Collection');

/*
 * Currently just an intermediate class to represent sequences of nodes.
 */
var NamedCollection = module.exports = new Class({

      inherits  : Collection
    , itemMap   : null
    , kind      : "NamedCollection"

    , init: function init (items){
        this.itemMap = {};
        init.super.call(this, items);
    }

    , hasItem: function(key){
        return !Types.undefined(this.itemMap[key]);
    }

    , getItem: function(key){
        return this[this.itemMap[key]];
    }

    , addItem: function(node){
        var key = node.getName();
        if(this.hasItem(key)){
            var child = this.getItem(key);
            child.merge(node);
        } else {
            this.push(node);
            this.itemMap[key] = this.length - 1;
        }
    }

});