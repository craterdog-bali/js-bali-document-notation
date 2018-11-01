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
 * probability element.
 */
var types = require('../abstractions/Types');
var codex = require('../utilities/Codex');
var Element = require('../abstractions/Element').Element;


/**
 * This constructor creates a new probability element.
 * 
 * @param {Number|Boolean|String} value The value of the probability.
 * @param {Parameters} parameters Optional parameters used to parameterize this element. 
 * @returns {Probability} The new probability element.
 */
function Probability(value, parameters) {
    Element.call(this, types.PROBABILITY, parameters);
    if (value === undefined || value === null) value = false;  // default value

    var type = value.constructor.name;
    switch (type) {
        case 'Boolean':
            if (value) {
                value = 1;
            } else {
                value = 0;
            }
            break;
        case 'Number':
            break;
        case 'String':
            if (value === 'true') {
                value = 1;
            } else if (value === 'false') {
                value = 0;
            } else {
                value = Number('0' + value);
            }
            break;
        default:
            throw new Error('PROBABILITY: An invalid value type was passed into the constructor: ' + type);
    }
    if (value < 0 || value > 1) {
        throw new Error('PROBABILITY: A probability must be in the range [0..1]: ' + value);
    }
    if (typeof Probability.FALSE !== 'undefined' && value === 'false') return Probability.FALSE;
    if (typeof Probability.TRUE !== 'undefined' && value === 'true') return Probability.TRUE;
    this.value = value;
    var source;
    if (value === 1) {
        source = 'true';
    } else if (value === 0) {
        source = 'false';
    } else {
        source = value.toString().substring(1);  // remove the leading '0'
    }
    this.setSource(source);
    return this;

}
Probability.prototype = Object.create(Element.prototype);
Probability.prototype.constructor = Probability;
exports.Probability = Probability;


/**
 * This method compares two probabilities for ordering.
 * 
 * @param {Probability} that The other probability to be compared with. 
 * @returns {Number} 1 if greater, 0 if equal, and -1 if less.
 */
Probability.prototype.comparedTo = function(that) {
    if (this.value < that.value) return -1;
    if (this.value > that.value) return 1;
    return 0;
};


/**
 * This method returns a boolean representation of the probability element. A
 * coin weighted with the probability is tossed and the boolean outcome is returned.
 * 
 * @returns {number} The boolean representation of the probability element.
 */
Probability.prototype.toBoolean = function () {
    return codex.coinToss(this.value);
};


/**
 * This method returns a numeric representation of the probability element.
 * 
 * @returns {number} The numeric representation of the probability element.
 */
Probability.prototype.toNumber = function () {
    return this.value;
};


// common constants
Probability.FALSE = new Probability('false');
Probability.TRUE = new Probability('true');
