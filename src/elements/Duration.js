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
 * This element class captures the state and methods associated with a time
 * duration element.
 */
const moment = require('moment');
const utilities = require('../utilities');
const abstractions = require('../abstractions');
const validate = utilities.validation.validate;


// PUBLIC FUNCTIONS

/**
 * This function creates a new duration element using the specified value.
 * 
 * @param {String|Number} value The source string the duration.
 * @param {Parameters} parameters Optional parameters used to parameterize this element. 
 * @param {Number} debug A number in the range [0..3].
 * @returns {Duration} The new duration element.
 */
function Duration(value, parameters, debug) {
    abstractions.Element.call(this, '$Duration', parameters, debug);
    if (this.debug > 1) validate('/bali/elements/Duration', '$Duration', '$value', value, [
        '/javascript/Undefined',
        '/javascript/String',
        '/javascript/Number'
    ], this.debug);
    value = value || 0;  // default value
    value = moment.duration(value);

    // since this element is immutable the value must be read-only
    this.getValue = function() { return value; };

    return this;
}
Duration.prototype = Object.create(abstractions.Element.prototype);
Duration.prototype.constructor = Duration;
exports.Duration = Duration;


// PUBLIC METHODS

/**
 * This method returns whether or not this component supports scaling operations.
 * <pre>
 *  * inverse
 *  * sum
 *  * difference
 *  * scaled
 * </pre>
 * 
 * @returns {Boolean} Whether or not this component supports scaling operations.
 */
Duration.prototype.isScalable = function() {
    return true;
};


/**
 * This method returns whether or not this duration has a meaningful value. If the value is zero
 * it returns <code>false</code>, otherwise it returns <code>true</code>.
 * 
 * @returns {Boolean} Whether or not this duration has a meaningful value.
 */
Duration.prototype.toBoolean = function() {
    return this.toNumber() !== 0;
};


/**
 * This method returns the number of milliseconds of the duration.
 * 
 * @returns {number} The number of milliseconds of the duration.
 */
Duration.prototype.toNumber = function() {
    return this.getValue().asMilliseconds();
};


/**
 * This method accepts a visitor as part of the visitor pattern.
 * 
 * @param {Visitor} visitor The visitor that wants to visit this element.
 */
Duration.prototype.acceptVisitor = function(visitor) {
    visitor.visitDuration(this);
};


// PUBLIC FUNCTIONS

/**
 * This function returns the inverse of a duration. If the specified duration is
 * positive, its inverse is negative and vice versa.
 * 
 * @param {Duration} duration The duration to be inverted.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Duration} The inverse of the specified duration.
 */
Duration.inverse = function(duration, debug) {
    debug = debug || 0;  // default value
    if (debug > 1) validate('/bali/elements/Duration', '$inverse', '$duration', duration, [
        '/bali/elements/Duration'
    ], debug);
    return new Duration(moment.duration().subtract(duration.getValue()).toISOString(), duration.getParameters(), debug);
};


/**
 * This function returns the sum of two durations.
 * 
 * @param {Duration} first The first duration to be summed.
 * @param {Duration} second The second duration to be summed.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Duration} The normalized sum of the two durations.
 */
Duration.sum = function(first, second, debug) {
    debug = debug || 0;  // default value
    if (debug > 1) validate('/bali/elements/Duration', '$sum', '$first', first, [
        '/bali/elements/Duration'
    ], debug);
    if (debug > 1) validate('/bali/elements/Duration', '$sum', '$second', second, [
        '/bali/elements/Duration'
    ], debug);
    return new Duration(first.getValue().clone().add(second.getValue()).toISOString(), first.getParameters(), debug);
};


/**
 * This function returns the difference of two durations.
 * 
 * @param {Duration} first The duration to be subtracted from.
 * @param {Duration} second The duration to subtract from the first duration.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Duration} The normalized difference of the two durations.
 */
Duration.difference = function(first, second, debug) {
    debug = debug || 0;  // default value
    if (debug > 1) validate('/bali/elements/Duration', '$difference', '$first', first, [
        '/bali/elements/Duration'
    ], debug);
    if (debug > 1) validate('/bali/elements/Duration', '$difference', '$second', second, [
        '/bali/elements/Duration'
    ], debug);
    return new Duration(first.getValue().clone().subtract(second.getValue()).toISOString(), first.getParameters(), debug);
};


/**
 * This function returns the specified duration scaled to the specified factor.
 * 
 * @param {Duration} duration The duration to be scaled.
 * @param {Number} factor The scale factor.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Duration} The normalized scaled duration.
 */
Duration.scaled = function(duration, factor, debug) {
    if (debug > 1) validate('/bali/elements/Duration', '$scaled', '$duration', duration, [
        '/bali/elements/Duration'
    ], debug);
    if (debug > 1) validate('/bali/elements/Duration', '$scaled', '$factor', factor, [
        '/javascript/Number'
    ], debug);
    return new Duration(moment.duration(Math.round(duration.getValue().asMilliseconds() * factor)).toISOString(), duration.getParameters(), debug);
};
