var   Types             = require('ee-types')
    , parser            = require('./_HeaderParser')
    , parsingFunction   = parser.parse.bind(parser);

parser.parse = function(value, rule) {
    if(Types.string(rule)) {
        return parsingFunction(value, { startRule: rule });
    }
    return parsingFunction(value, rule);
};

module.exports = parser;