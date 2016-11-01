"use strict";

var   assert    = require('assert')
    , Class     = require('ee-class')
    , Types     = require('ee-types');

var ParserAssertion = module.exports = new Class({
    parse: function(parser, input, rule){
        return parser.parse(input, rule);
    }

    , parseTo: function(parser, input, rule, expected, strict){
        var result = this.parse(parser, input, rule);
        this._compare(expected, result.toString(), strict);
        return result;
    }

    , _compare: function(expected, result, strict){
        if(strict === true){
            assert.strictEqual(expected, result);
        } else {
            assert.equal(expected, result);
        }
    }

    , transformAndParseTo: function(parser, input, rule, transformer, expected, strict){
        var result = this.parse(parser, input, rule);
        this._compare(transformer(result), expected, strict);
        return result;
    }

    , parseAndCompare: function(parser, input, rule, comparator){
        var result = this.parse(parser, input, rule);
        comparator(result, input, rule);
        return result;
    }

    , parseToDeep: function(parser, input, rule, expected){
        var result = this.parse(parser, input, rule);
        assert.deepEqual(expected, result);
        return result;
    }

    , fail: function(parser, input, rule){
        assert.throws(function(){
            this.parse(input, rule);
        }.bind(this))
    }

    , forParser : function(parser){
        return new ParserBoundAssertion(parser, this);
    }

});

ParserAssertion.forParser = function(parser){
    return new ParserBoundAssertion(parser, new ParserAssertion());
};

var ParserBoundAssertion = new Class({

      parser: null
    , asserter: null

    , init: function(parser, asserter){
        this.parser     = parser;
        this.asserter   = asserter;
    }

    , parseTo: function parseTo(input, rule, expected, strict){
        return this.asserter.parseTo(this.parser, input, rule, expected, strict);
    }

    , parseAndCompare: function parseAndCompare(input, rule, comparator){
        return this.asserter.parseAndCompare(this.parser, input, rule, comparator);
    }

    , parseToDeep: function parseToDeep(input, rule, expected){
        return this.asserter.parseToDeep(this.parser, input, rule, expected);
    }

    , fail: function fail(input, rule){
        return this.asserter.fail(this.parser, input, rule);
    }

    , parse: function parse(input, rule){
        return this.asserter.parse(this.parser, input, rule);
    }

    , transformAndParseTo: function(input, rule, transformer, strict){
        return this.asserter.transformAndParseTo(this.parser, input, rule, transformer, strict);
    }

    , forRule : function(rule){
        return new RuleBoundAssertion(rule, this);
    }
});

var RuleBoundAssertion = new Class({

      rule: null

    , init: function init(rule, asserter){
        this.asserter   = asserter;
        this.rule       = rule;
    }

    , parseTo: function parseTo(input, expected, strict){
        return this.asserter.parseTo(input, this.rule, expected, strict);
    }

    , parseAndCompare: function parseAndCompare(input, comparator){
        return this.asserter.parseAndCompare(input, this.rule, comparator);
    }

    , parseToDeep: function parseToDeep(input, expected){
        return this.asserter.parseToDeep(input, this.rule, expected);
    }

    , fail: function fail(input){
        return this.asserter.fail(input, this.rule);
    }

    , parse: function parse(input){
        return this.asserter.parse(input, this.rule);
    }

    , transformAndParseTo: function(input, transformer, strict){
        return this.asserter.transformAndParseTo(input, this.rule, transformer, strict);
    }
});