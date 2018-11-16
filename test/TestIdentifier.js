/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/

var mocha = require('mocha');
var expect = require('chai').expect;
var types = require('../src/abstractions/Types');
var Identifier = require('../src/elements/Identifier').Identifier;

describe('Bali Component Framework™', function() {

    describe('Test identifier constructors', function() {

        it('should throw an exception for an empty identifier', function() {
            expect(
                function() {
                    var empty = new Identifier(types.VARIABLE);
                }
            ).to.throw();
            expect(
                function() {
                    var empty = new Identifier(types.VARIABLE, '');
                }
            ).to.throw();
        });

        it('should throw an exception for a identifier containing white space', function() {
            expect(
                function() {
                    var bad = new Identifier(types.VARIABLE, ' ');
                }
            ).to.throw();
            expect(
                function() {
                    var bad = new Identifier(types.VARIABLE, 'White Space');
                }
            ).to.throw();
        });

        it('should construct a identifier and format the same identifier', function() {
            var identifier = new Identifier(types.VARIABLE, 'foobar');
            var source = identifier.toString();
            expect(source).to.equal('foobar');
            var string = identifier.toString();
            expect(string).to.equal('foobar');
        });

    });

});
