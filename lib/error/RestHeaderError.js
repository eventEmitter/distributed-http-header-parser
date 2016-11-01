"use strict";

var   Class = require('ee-class')
    , log   = require('ee-log');

var RestHeaderError = {
      inherits: Error
    , message: null
    , init: function initialize(message) {
        initialize.super.call(this, message);
        Error.captureStackTrace(this, initialize);
        this.message = message;
    }
};

module.exports = new Class(RestHeaderError);