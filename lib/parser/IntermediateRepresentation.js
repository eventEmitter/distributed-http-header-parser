/**
 * Facade that creates intermediate representations from the parse tree.
 */
var   Class   = require('ee-class')
    , log     = require('ee-log')
    , Types   = require('ee-types')
    , nodes   = require('../nodes');

var IR = module.exports = {

    identifier(identifier){
        return new nodes.IdentifierNode(identifier);
    }

    , access_dot(accesses){

        if(accesses.length == 0) return null;

        var   rootName  = accesses.shift().pop()
            , root      = new nodes.SelectorNode( rootName )
            , parent    = root;

        while(accesses.length > 0){

            var   current = accesses.shift()
                , node    = new nodes.SelectorNode( current.pop() );

            node.addToParent(parent);
            parent = node;
        }

        return root;
    }

    , access_array(nestedSelect){ return nestedSelect; }

    , access_extended(result)   { return result; }

    , wildcard(wc)              { return new nodes.IdentifierNode( wc ); }

    , selector_base(base, dotAccess){
        var selector = new nodes.SelectorNode(base);
        if(dotAccess) dotAccess.addToParent(selector);
        return selector;
    }

    , selector_extended(base, extendedSelector){
        if(extendedSelector) base.getLeafNodes().forEach(node => { extendedSelector.addToParent(node) });
        return base;
    }

    , selector(result){
        //log(result);
        return result;
    }

    , arr(items){
        items = items || [];
        return new nodes.ArrayNode(items);
    }

    , func: function(name, params){
        return new nodes.FunctionNode(name, params);
    }

    , select: function(items){
        return new nodes.statements.SelectStatement(items);
    }

    , select_item : function(selector, aliases){
        if(aliases){
            var alias = aliases.pop();
            selector.getLeafNodes().forEach((node)=>{ node.setAlias(alias); });
        }
        return selector;
    }

    , filter: function(node){
        return new nodes.statements.FilterStatement(node.getChildren());
    }

    , filter_selector: function(base, extended){
        if(extended) {
            base.getLeafNodes().forEach((node)=> { extended.addToParent(node); });
        }
        return base;
    }

    , filter_access_array : function(nested_filter) {
        return nested_filter;
    }

    , filter_selector_extended : function(result){
        return result;
    }

    , and_statement : function(single, more){
        var flattened = [single];
        more.forEach((pair)=>{ flattened.push(pair.pop())});
        return new nodes.AndNode(flattened);
    }

    , filter_item: function(selector, comparison){
        if(comparison){
            //@todo: clone the comparison upfront
            selector.getLeafNodes().forEach((node)=>{ node.setComparison(comparison); });
        }
        return selector;
    }

    , comparison: function(operator, value){
        return new nodes.ComparisonNode(operator, value);
    }

    , date: function(year, month, day, hour, min, sec) {
        var date = new Date(year, month-1, day, hour, min, sec, 0);
        return new nodes.DateNode(date);
    }

    , order: function(items){
        return new nodes.statements.OrderStatement(items);
    }

    , order_item: function(base, direction){
        return new nodes.statements.OrderItem(base, direction);
    }

    , literal: function(value){
        return new nodes.LiteralNode(value);
    }

    , null(value){
        return null;
    }

    , values: function(elements){
        return new nodes.collections.Collection(elements);
    }
};