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
 * percent element.
 */
const utilities = require('../utilities');
const abstractions = require('../abstractions');


// PUBLIC CONSTRUCTORS

/**
 * This constructor creates a new percent element.
 * 
 * @param {Number} value The value of the percent.
 * @param {Parameters} parameters Optional parameters used to parameterize this element. 
 * @returns {Percent} The new percent element.
 */
function Percent(value, parameters) {
    abstractions.Element.call(this, utilities.types.PERCENT, parameters);
    if (value === undefined || value === null) value = 0;  // default value
    this.value = value;
    this.setSource(this.toLiteral(parameters));
    return this;
}
Percent.prototype = Object.create(abstractions.Element.prototype);
Percent.prototype.constructor = Percent;
exports.Percent = Percent;


/**
 * This constructor creates an immutable instance of a percent using the specified
 * literal string.
 * 
 * @constructor
 * @param {String} literal The literal string defining the percent.
 * @param {Parameters} parameters Optional parameters used to parameterize this element. 
 * @returns {Percent} The new percent.
 */
Percent.fromLiteral = function(literal, parameters) {
    literal = literal.slice(0, -1);  // remove the trailing '%'
    const value = abstractions.Element.literalToNumber(literal);
    const percent = new Percent(value, parameters);
    return percent;
};


// PUBLIC METHODS

/**
 * This method returns a literal string representation of the component.
 * 
 * @param {Parameters} parameters Any parameters that are needed for formatting.
 * @returns {String} The corresponding literal string representation.
 */
Percent.prototype.toLiteral = function(parameters) {
    var literal = abstractions.Element.numberToLiteral(this.value);
    literal += '%';  // append the %
    return literal;
};


/**
 * This method returns whether or not this percent has a meaningful value. If the value is zero
 * it returns <code>false</code>, otherwise it returns <code>true</code>.
 * 
 * @returns {Boolean} Whether or not this percent has a meaningful value.
 */
Percent.prototype.toBoolean = function() {
    return this.value !== 0;
};


/**
 * This method returns the numeric value of the percent element, e.g. 25% => 0.25
 * 
 * @returns {number} The numeric value of the percent element.
 */
Percent.prototype.toNumber = function() {
    return utilities.precision.quotient(this.value, 100);
};


// PUBLIC FUNCTIONS

/**
 * This function returns the inverse of a percent.
 * 
 * @param {Percent} percent The percent to be inverted.
 * @throws {Error} The percent cannot be negative.
 */
Percent.inverse = function(percent) {
    return new Percent(-percent.value);
};


/**
 * This function returns the sum of two percents.
 * 
 * @param {Percent} firstPercent The first percent to be summed.
 * @param {Percent} secondPercent The second percent to be summed.
 * @returns {Percent} The normalized sum of the two percents.
 */
Percent.sum = function(firstPercent, secondPercent) {
    return new Percent(utilities.precision.sum(firstPercent.value, secondPercent.value));
};


/**
 * This function returns the difference of two percents.
 * 
 * @param {Percent} firstPercent The percent to be subtracted from.
 * @param {Percent} secondPercent The percent to subtract from the first percent.
 * @returns {Percent} The normalized difference of the two percents.
 */
Percent.difference = function(firstPercent, secondPercent) {
    return new Percent(utilities.precision.difference(firstPercent.value, secondPercent.value));
};


/**
 * This function returns the specified percent scaled to the specified factor.
 * 
 * @param {Percent} percent The percent to be scaled.
 * @param {Number} factor The scale factor.
 * @returns {Percent} The normalized scaled percent.
 */
Percent.scaled = function(percent, factor) {
    return new Percent(utilities.precision.product(percent.value, factor));
};

