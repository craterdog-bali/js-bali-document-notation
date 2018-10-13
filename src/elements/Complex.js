/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/
'use strict';

/*
 * This element class captures the state and methods associated with a
 * complex number element.
 */
var antlr = require('antlr4');
var grammar = require('../../grammar');
var types = require('../abstractions/Types');
var Element = require('../abstractions/Element').Element;
var Angle = require('./Angle').Angle;
/* global NaN, Infinity */


/**
 * This constructor creates an immutable instance of a complex number element.
 * The allowed ways to call it include:
 * <pre><code>
 * new Complex()  // defaults to zero
 * new Complex('(3, 4i)')  // rectangular form
 * new Complex('(12.3e-45 e^3.1415926i)')  // polar form
 * </code></pre>
 * 
 * @constructor
 * @param {String} value The string value of the complex number.
 * @param {Parameters} parameters Optional parameters used to parameterize this element. 
 * @returns {Complex} The new complex element.
 */
function Complex(value, parameters) {
    Element.call(this, types.NUMBER, parameters);
    value = value || '0';  // default to zero
    this.format = 'rectangular';  // rectangular coordinates by default
    var real;
    var imaginary;
    // Complex(value): constructor generates a complex number from a string
    var chars = new antlr.InputStream(value);
    var lexer = new grammar.BaliDocumentLexer(chars);
    var tokens = new antlr.CommonTokenStream(lexer);
    var parser = new grammar.BaliDocumentParser(tokens);
    parser.buildParseTrees = true;
    var tree = parser.number();
    var nodeType = tree.constructor.name;
    switch (nodeType) {
        case 'UndefinedNumberContext':
            this.real = NaN;
            this.imaginary = NaN;
            this.magnitude = NaN;
            this.angle = new Angle(0);
            break;
        case 'InfiniteNumberContext':
            this.real = Infinity;
            this.imaginary = Infinity;
            this.magnitude = Infinity;
            this.angle = new Angle(0);
            break;
        case 'RealNumberContext':
            real = tree.real();
            this.real = realToNumber(real);
            this.imaginary = 0;
            break;
        case 'ImaginaryNumberContext':
            imaginary = tree.imaginary();
            this.real = 0;
            this.imaginary = imaginaryToNumber(imaginary);
            break;
        case 'ComplexNumberContext':
            real = tree.real();
            imaginary = tree.imaginary();
            var delimiter = tree.del.text;
            if (delimiter === ',') {
                this.real = realToNumber(real);
                this.imaginary = imaginaryToNumber(imaginary);
            } else {
                this.format = 'polar';
                this.magnitude = realToNumber(real);
                this.angle = new Angle(imaginaryToNumber(imaginary));
                this.normalize();
            }
            break;
        default:
            throw new Error('COMPLEX: An invalid string was passed to the constructor : ' + value);
    }
    if (this.isUndefined() && typeof Complex.UNDEFINED !== 'undefined') return Complex.UNDEFINED;
    if (this.isZero() && typeof Complex.ZERO !== 'undefined') return Complex.ZERO;
    if (this.isInfinite() && typeof Complex.INFINITY !== 'undefined') return Complex.INFINITY;
    var source;
    if (this.format === 'rectangular') {
        source = this.toRectangular();
    } else {
        source = this.toPolar();
    }
    this.setSource(source);
    return this;
}
Complex.prototype = Object.create(Element.prototype);
Complex.prototype.constructor = Complex;
exports.Complex = Complex;


/**
 * This method normalizes the magnitude and angle if the complex number is in polar form.
 */
Complex.prototype.normalize = function() {
    if (this.format === 'polar') {
        if (this.magnitude < 0) {
            this.magnitude = -this.magnitude;
            this.angle = Angle.inverse(this.angle);
        }
    }
};


/**
 * This method determines whether the complex number is undefined.
 * 
 * @returns {boolean}
 */
Complex.prototype.isUndefined = function() {
    return this.getMagnitude().toString() === 'NaN';  // must use strings since NaN !== NaN
};


/**
 * This method determines whether the complex number is zero.
 * 
 * @returns {boolean}
 */
Complex.prototype.isZero = function() {
    return this.getMagnitude() === 0;
};


/**
 * This method determines whether the complex number is infinite.
 * 
 * @returns {boolean}
 */
Complex.prototype.isInfinite = function() {
    return this.getMagnitude() === Infinity;
};


/**
 * This method returns the real part of the complex number.
 * 
 * @returns {number}
 */
Complex.prototype.getRealPart = function() {
    if (typeof this.real === 'undefined') {
        this.real = lockOnPole(this.magnitude * Angle.cosine(this.angle));
    }
    return this.real;
};


/**
 * This method returns the imaginary part of the complex number.
 * 
 * @returns {number}
 */
Complex.prototype.getImaginaryPart = function() {
    if (typeof this.imaginary === 'undefined') {
        this.imaginary = lockOnPole(this.magnitude * Angle.sine(this.angle));
    }
    return this.imaginary;
};


/**
 * This method returns the magnitude of the complex number.
 * 
 * @returns {number}
 */
Complex.prototype.getMagnitude = function() {
    if (typeof this.magnitude === 'undefined') {
        this.magnitude = Math.sqrt(Math.pow(this.real, 2) + Math.pow(this.imaginary, 2));
    }
    return this.magnitude;
};


/**
 * This method returns the angel of the complex number.
 * 
 * @returns {Angle}
 */
Complex.prototype.getAngle = function() {
    if (typeof this.angle === 'undefined') {
        var angle = Angle.arctangent(this.imaginary, this.real).toNumber();
        angle = lockOnPole(angle);
        this.angle = new Angle(angle);
    }
    return this.angle;
};


/**
 * This method compares two complex numbers for ordering.
 * 
 * @param {Complex} that The other complex number to be compared with. 
 * @returns {Number} 1 if greater, 0 if equal, and -1 if less.
 */
Complex.prototype.comparedWith = function(that) {
    if (this.real < that.real) return -1;
    if (this.real > that.real) return 1;
    // the real parts are equal, check the imaginary parts
    if (this.imaginary < that.imaginary) return -1;
    if (this.imaginary > that.imaginary) return 1;
    // they are also equal
    return 0;
};


/**
 * This method returns a string version of the complex number in retangular form.
 * 
 * @returns {String}
 */
Complex.prototype.toRectangular = function() {
    if (this.isUndefined()) return 'undefined';
    if (this.isZero()) return '0';
    if (this.isInfinite()) return 'infinity';
    if (this.getRealPart() === 0) return imaginaryToString(this.getImaginaryPart());
    if (this.getImaginaryPart() === 0) return realToString(this.getRealPart());
    var string = '(';
    string += realToString(this.getRealPart());
    string += ', ';
    string += imaginaryToString(this.getImaginaryPart());
    string += ')';
    return string;
};


/**
 * This method returns a string version of the complex number in polar form.
 * 
 * @returns {String}
 */
Complex.prototype.toPolar = function() {
    if (this.isUndefined()) return 'undefined';
    if (this.isZero()) return '0';
    if (this.isInfinite()) return 'infinity';
    if (this.getAngle() === Angle.ZERO) return realToString(this.getRealPart());
    var string = '(';
    string += realToString(this.getMagnitude());
    string += ' e^';
    string += imaginaryToString(this.getAngle());
    string += ')';
    return string;
};


/**
 * This method returns the real part of the complex number.
 * 
 * @returns {number}
 */
Complex.prototype.toNumber = function() {
    return this.getRealPart();
};


Complex.UNDEFINED = new Complex('undefined');
Complex.ZERO = new Complex('0');
Complex.INFINITY = new Complex('infinity');


function lockOnPole(number) {
    if (number > 0 && number <= 6.123233995736766e-16) return 0;
    if (number < 0 && number >= -6.123233995736766e-16) return 0;
    if (number > 0 && number >= 16331239353195370) return Infinity;
    if (number < 0 && number <= -16331239353195370) return Infinity;
    return number;
}


/**
 * This function returns the Bali string representation of a real number.
 * 
 * @param {number} real The real number.
 * @returns {String} The Bali string for that number.
 */
function realToString(real) {
    var string = real.toString();
    switch (string) {
        case '-2.718281828459045':
            string = '-e';
            break;
        case '2.718281828459045':
            string = 'e';
            break;
        case '-3.141592653589793':
            string = '-pi';
            break;
        case '3.141592653589793':
            string = 'pi';
            break;
        case '-1.618033988749895':
            string = '-phi';
            break;
        case '1.618033988749895':
            string = 'phi';
            break;
        case 'Infinity':
        case '-Infinity':
            string = 'infinity';
            break;
        case 'NaN':
            string = 'undefined';
            break;
        default:
            // must replace the 'e' in the JS exponent with 'E' for the Bali exponent
            string = string.replace(/e\+?/g, 'E');
    }
    return string;
}


/**
 * This function returns the Bali string representation of an imaginary number.
 * 
 * @param {number} imaginary The imaginary number.
 * @returns {String} The Bali string for that number.
 */
function imaginaryToString(imaginary) {
    var string = realToString(imaginary);
    switch (string) {
        case '-1':
            string = '-i';
            break;
        case '1':
            string = 'i';
            break;
        case '-e':
        case 'e':
        case '-pi':
        case 'pi':
        case '-phi':
        case 'phi':
            string += ' i';
            break;
        case 'infinity':
        case 'undefined':
            break;
        default:
            string += 'i';
    }
    return string;
}


function realToNumber(baliReal) {
    var jsNumber;
    if (baliReal.constructor.name === 'ConstantRealContext') {
        var constant = baliReal.CONSTANT().getText();
        switch (constant) {
            case 'e':
                jsNumber = 2.718281828459045;
                break;
            case 'pi':
                jsNumber = 3.141592653589793;
                break;
            case 'phi':
                jsNumber = 1.618033988749895;
                break;
        }
        if (baliReal.sign) {
            jsNumber = -jsNumber;
        }
        return jsNumber;
    } else {
        var string = baliReal.FLOAT().getText();
        jsNumber = Number(string);
        return jsNumber;
    }
}


function imaginaryToNumber(baliImaginary) {
    var real = baliImaginary.real();
    var sign = baliImaginary.sign;
    var jsNumber = 1;
    if (real) {
        jsNumber = realToNumber(real);
    } else if (sign) {
        jsNumber = -jsNumber;
    }
    return jsNumber;
}

