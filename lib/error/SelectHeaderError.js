"use strict";

var   Class = require('ee-class')
    , log   = require('ee-log')

    , RestHeaderError = require('./RestHeaderError');

var SelectHeaderError = {
  inherits: RestHeaderError
};

module.exports = new Class(SelectHeaderError);