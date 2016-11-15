var   log     = require('ee-log')
    , assert  = require('assert')
    , parser  = require('../lib/parser/HeaderParser')
    , pAssert = require('./ParserAssertion').forParser(parser);



describe('Syntax-Literal', function(){
    describe('string', function(){

        var str = pAssert.forRule('value');

        it('should parse strings in single quotes', function(){
            assert.equal(str.parse("'single quoted'").value, "single quoted");
        });

        it('should parse strings in double quotes', function(){
            var node = str.parse('"double quoted"');
            assert.equal(node.value, "double quoted");
        });

        it('should parse escaped strings', function(){
            var node = str.parse('"double \\"quoted"');
            assert.equal(node.value, 'double \\"quoted');
        });

        it('should parse special characters', function(){
            var node = str.parse('"wäääu"');
            assert.equal(node.value, 'wäääu');
        });
    });

    describe('identifier', function(){

        var identifier = pAssert.forRule('identifier');

        it('should parse a valid identifier', function(){
            var input = 'indentificado';
            identifier.parseTo(input, input);
        });

        it('should not parse the wildcard', function(){
            identifier.fail('*');
        });

        it('should not parse invalid identifiers', function(){
            identifier.fail('1some');
        });
    });

    describe('boolean', function(){
        var bool = pAssert.forRule('value');
        it('should parse boolean true', function(){
            assert.strictEqual(bool.parse("true").value, true);
        });
        it('should parse boolean false', function(){
            assert.strictEqual(bool.parse("false").value, false);
        });
        it('should fail on identifiers', function(){
            bool.fail("identico");
        });
    });

    describe('number', function(){
        var value = pAssert.forRule('value');

        it('should parse integers', function(){
            assert.strictEqual(value.parse("1").value, 1);
        });

        it('should parse multi valued integers', function(){
            assert.strictEqual(value.parse("100").value, 100);
        });

        it('should parse floats', function(){
            assert.strictEqual(value.parse("100.0").value, 100.0);
        });

        it('should parse negative integers', function(){
            assert.strictEqual(value.parse("-100").value, -100);
        });

        it('should parse negative floats', function(){
            assert.strictEqual(value.parse("-5.3").value, -5.3);
        });

        it('should fail on identifiers', function(){
            value.fail("identico");
        });
    });

    describe('null', function(){
        var value = pAssert.forRule('value');

        it('should parse null', function(){
            assert.strictEqual(value.parse("null").value, null);
        });

        it('should fail on identifiers', function(){
            value.fail("identico");
        });
    });
});