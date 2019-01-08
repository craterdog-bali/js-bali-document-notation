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
const precision = require('../utilities/Precision');
const random = require('../utilities/Random');
const types = require('../abstractions/Types');
const Element = require('../abstractions/Element').Element;


// PUBLIC CONSTRUCTORS

/**
 * This constructor creates a new probability element.
 * 
 * @param {Number|Boolean} value The value of the probability.
 * @param {Parameters} parameters Optional parameters used to parameterize this element. 
 * @returns {Probability} The new probability element.
 */
function Probability(value, parameters) {
    Element.call(this, types.PROBABILITY, parameters);
    if (value === undefined || value === null) value = false;  // default value
    if (typeof value === 'boolean') value = value ? 1 : 0;
    if (value < 0 || value > 1) {
        throw new Error('BUG: An invalid probability value was passed to the constructor: ' + value);
    }
    this.value = value;
    this.setSource(this.toLiteral());
    return this;

}
Probability.prototype = Object.create(Element.prototype);
Probability.prototype.constructor = Probability;
exports.Probability = Probability;


/**
 * This constructor creates an immutable instance of a probability using the specified
 * literal string.
 * 
 * @constructor
 * @param {String} literal The literal string defining the probability.
 * @param {Parameters} parameters Optional parameters used to parameterize this element. 
 * @returns {Probability} The new probability.
 */
Probability.fromLiteral = function(literal, parameters) {
    var value;
    switch (literal) {
        case 'false':
            value = 0;
            break;
        case 'true':
            value = 1;
            break;
        default:
            value = Number('0' + literal);  // add the leading '0'
    }
    const probability = new Probability(value, parameters);
    return probability;
};


// PUBLIC METHODS

/**
 * This method returns a literal string representation of the component.
 * 
 * @param {Boolean} asCanonical Whether or not the element should be formatted using its
 * default format.
 * @returns {String} The corresponding literal string representation.
 */
Probability.prototype.toLiteral = function(asCanonical) {
    var literal;
    switch (this.value) {
        case 0:
            literal = 'false';
            break;
        case 1:
            literal = 'true';
            break;
        default:
            literal = this.value.toString().substring(1);  // remove the leading '0'
    }
    return literal;
};


/**
 * This method returns a boolean representation of the probability element. A
 * coin weighted with the probability is tossed and the boolean outcome is returned.
 * 
 * @returns {number} The boolean representation of the probability element.
 */
Probability.prototype.toBoolean = function() {
    return this.value >= 0.5;
};


/**
 * This method returns a numeric representation of the probability element.
 * 
 * @returns {number} The numeric representation of the probability element.
 */
Probability.prototype.toNumber = function() {
    return this.value;
};


// PUBLIC CONSTANTS

Probability.FALSE = new Probability('false');
Probability.TRUE = new Probability('true');


// PUBLIC FUNCTIONS

/**
 * This function returns a new random probability element in the range [false..true].
 * 
 * @returns {Probability} A new random probability.
 */
Probability.random = function() {
    const probability = random.probability();
    return new Probability(probability);
};


/**
 * This function returns a boolean valued probability by flipping a coin that is
 * weighted using the specified probability. If a random probability is less than
 * the specified weighting then the result is <code>true</code>, otherwise it is
 * <code>false</code>.
 *
 * @param {Probability} weighting The probability.
 * @returns {Boolean} The resulting probability.
 */
Probability.coinToss = function(weighting) {
    const probability = random.probability();
    return probability < weighting;
};


/**
 * This function returns a new probability that is the logical NOT of the specified
 * probability. It represents the likelihood that the probability is false.
 * The logical NOT is equal to:
 * <pre>
 *    pNOT = 1 - p
 * </pre>
 *
 * @param {Probability} probability The probability.
 * @returns {Probability} The resulting probability.
 */
Probability.not = function(probability) {
    const p = precision.difference(1, probability.value);
    const result = new Probability(p);
    return result;
};


/**
 * This function returns a new probability that is the logical AND of the two specified
 * probabilities. It represents the likelihood that the first probability is true and the
 * second probability is true. The logical AND is equal to:
 * <pre>
 *    pAND = p1 * p2
 * </pre>
 *
 * @param {Probability} probability1 The first probability.
 * @param {Probability} probability2 The second probability.
 * @returns {Probability} The resulting probability.
 */
Probability.and = function(probability1, probability2) {
    const p1 = probability1.value;
    const p2 = probability2.value;
    const p = precision.product(p1, p2);
    const result = new Probability(p);
    return result;
};


/**
 * This function returns a new probability that is the logical SANS of the two specified
 * probabilities. It represents the likelihood that the first probability is true but the
 * second probability is not. The logical SANS is equal to:
 * <pre>
 *    pSANS = p1 AND NOT p2
 *          = p1 * (1 - p2)
 * </pre>
 *
 * @param {Probability} probability1 The first probability.
 * @param {Probability} probability2 The second probability.
 * @returns {Probability} The resulting probability.
 */
Probability.sans = function(probability1, probability2) {
    const p1 = probability1.value;
    const p2 = probability2.value;
    const p = precision.product(p1, precision.difference(1, p2));
    const result = new Probability(p);
    return result;
};


/**
 * This function returns a new probability that is the logical OR of the two specified
 * probabilities. It represents the likelihood that the first probability is true or the
 * second probability is true or both are true. The logical OR is equal to:
 * <pre>
 *    pOR = NOT (NOT p1 AND NOT p2)
 *        = 1 - (1 - p1) * (1 - p2)
 *        = p1 + p2 - p1 * p2
 * </pre>
 *
 * @param {Probability} probability1 The first probability.
 * @param {Probability} probability2 The second probability.
 * @returns {Probability} The resulting probability.
 */
Probability.or = function(probability1, probability2) {
    const p1 = probability1.value;
    const p2 = probability2.value;
    const p = precision.sum(p1, p2, precision.product(-p1, p2));
    const result = new Probability(p);
    return result;
};


/**
 * This function returns a new probability that is the logical XOR of the two specified
 * probabilities. It represents the likelihood that the first probability is true or the
 * second probability is true but not both. The logical XOR is equal to:
 * <pre>
 *    pXOR = (p1 SANS p2) + (p2 SANS p1)
 *         = p1 * (1 - p2) + p2 * (1 - p1)
 *         = p1 + p2 - 2 * (p1 * p2)
 * </pre>
 *
 * @param {Probability} probability1 The first probability.
 * @param {Probability} probability2 The second probability.
 * @returns {Probability} The resulting probability.
 */
Probability.xor = function(probability1, probability2) {
    const p1 = probability1.value;
    const p2 = probability2.value;
    const p = precision.sum(p1, p2, precision.product(-2, p1, p2));
    const result = new Probability(p);
    return result;
};

