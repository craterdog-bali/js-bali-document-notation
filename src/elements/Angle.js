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
 * This class captures the state, methods, and functions associated with an angle element.
 */
const utilities = require('../utilities');
const types = require('../types');
const Exception = require('../structures/Exception').Exception;


// PUBLIC FUNCTIONS

/**
 * This function creates an immutable instance of an angle using the specified value.
 *
 * @param {Number} value The value of the angle.
 * @param {Object} parameters Optional parameters used to parameterize this element.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Angle} The new angle element.
 */
const Angle = function(value, parameters, debug) {
    types.Element.call(
        this,
        ['/bali/elements/Angle'],
        [
            '/bali/interfaces/Scalable',
            '/bali/interfaces/Numerical'
        ],
        parameters,
        debug
    );
    if (this.debug > 1) {
        const validator = new utilities.Validator(this.debug);
        validator.validateType('/bali/elements/Angle', '$Angle', '$value', value, [
            '/javascript/Undefined',
            '/javascript/Number'
        ]);
    }

    // check the value
    if (value === value) value = value || 0;  // default value if not NaN and not defined
    if (!isFinite(value)) {
        const exception = new Exception({
            $module: '/bali/elements/Angle',
            $procedure: '$Angle',
            $exception: '$invalidParameter',
            $parameter: value,
            $text: 'An invalid angle value was passed to the constructor.'
        });
        if (this.debug > 0) console.error(exception.toString());
        throw exception;
    }

    // convert the value if necessary
    this.calculator = new utilities.Calculator(this.debug);
    const units = this.getParameter('$units');
    if (units && units.toString() === '$degrees') {
        // convert degrees to radians
        value = this.calculator.quotient(this.calculator.product(value, Math.PI), 180);
    }

    // lock onto π if appropriate
    value = this.calculator.lockOnAngle(value);

    // normalize the value to the range (-π..π]
    const twoPi = this.calculator.product(Math.PI, 2);
    if (value < -twoPi || value > twoPi) {
        value = this.calculator.remainder(value, twoPi);  // make in the range (-2π..2π)
    }
    if (value > Math.PI) {
        value = this.calculator.difference(value, twoPi);  // make in the range (-π..π]
    } else if (value <= -Math.PI) {
        value = this.calculator.sum(value, twoPi);  // make in the range (-π..π]
    }
    if (value === -0) value = 0;  // normalize to positive zero

    // since this element is immutable the value must be read-only
    this.getValue = function() { return value; };

    return this;
};
Angle.prototype = Object.create(types.Element.prototype);
Angle.prototype.constructor = Angle;
exports.Angle = Angle;


// PUBLIC METHODS

/**
 * This method returns whether or not this angle has a meaningful value. If the value is zero
 * it returns <code>false</code>, otherwise it returns <code>true</code>.
 *
 * @returns {Boolean} Whether or not this angle has a meaningful value.
 */
Angle.prototype.toBoolean = function() {
    return this.getValue() !== 0;
};


/**
 * This method returns the numeric value of the angle.
 *
 * @returns {Number} The numeric value of the angle.
 */
Angle.prototype.toNumber = function() {
    return this.getValue();
};


/**
 * This method returns the value of the angle in radians.
 *
 * @returns {Number} The value of the angle in radians.
 */
Angle.prototype.getRadians = function() {
    return this.getValue();
};


/**
 * This method returns the value of the angle in degrees.
 *
 * @returns {Number} The value of the angle in degrees.
 */
Angle.prototype.getDegrees = function() {
    const value = this.calculator.quotient(this.calculator.product(this.getValue(), 180), Math.PI);
    return value;
};


/**
 * This method accepts a visitor as part of the visitor pattern.
 *
 * @param {Visitor} visitor The visitor that wants to visit this element.
 */
Angle.prototype.acceptVisitor = function(visitor) {
    visitor.visitAngle(this);
};


// PUBLIC FUNCTIONS

/**
 * This function returns the inverse of an angle.
 *
 * @param {Angle} angle The angle to be inverted.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Angle} The inverted angle.
 */
Angle.inverse = function(angle, debug) {
    if (debug > 1) {
        const validator = new utilities.Validator(debug);
        validator.validateType('/bali/elements/Angle', '$inverse', '$angle', angle, [
            '/bali/elements/Angle'
        ]);
    }
    const calculator = new utilities.Calculator(debug);
    return new Angle(calculator.difference(angle.getValue(), Math.PI), angle.getParameters(), debug);
};


/**
 * This function returns the complement of an angle. The complementary angle
 * adds to the specified angle to equal π/2.
 *
 * @param {Angle} angle The angle to be complemented.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Angle} The complementary angle.
 */
Angle.complement = function(angle, debug) {
    if (debug > 1) {
        const validator = new utilities.Validator(debug);
        validator.validateType('/bali/elements/Angle', '$complement', '$angle', angle, [
            '/bali/elements/Angle'
        ]);
    }
    const calculator = new utilities.Calculator(debug);
    return new Angle(calculator.difference(Math.PI / 2, angle.getValue()), angle.getParameters(), debug);
};


/**
 * This function returns the supplement of an angle. The supplementary angle
 * adds to the specified angle to equal π.
 *
 * @param {Angle} angle The angle to be supplemented.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Angle} The supplemental angle.
 */
Angle.supplement = function(angle, debug) {
    if (debug > 1) {
        const validator = new utilities.Validator(debug);
        validator.validateType('/bali/elements/Angle', '$supplement', '$angle', angle, [
            '/bali/elements/Angle'
        ]);
    }
    const calculator = new utilities.Calculator(debug);
    return new Angle(calculator.difference(Math.PI, angle.getValue()), angle.getParameters(), debug);
};


/**
 * This function returns the conjugate of an angle. The conjugated angle
 * adds to the specified angle to equal 2π.
 *
 * @param {Angle} angle The angle to be conjugated angle.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Angle} The conjugated angle.
 */
Angle.conjugate = function(angle, debug) {
    if (debug > 1) {
        const validator = new utilities.Validator(debug);
        validator.validateType('/bali/elements/Angle', '$conjugate', '$angle', angle, [
            '/bali/elements/Angle'
        ]);
    }
    return new Angle(-angle.getValue(), angle.getParameters(), debug);
};


/**
 * This function returns the sum of two angles. The result will be normalized to be in
 * the range (-π..π].
 *
 * @param {Angle} first The first angle to be summed.
 * @param {Angle} second The second angle to be summed.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Angle} The normalized sum of the two angles.
 */
Angle.sum = function(first, second, debug) {
    if (debug > 1) {
        const validator = new utilities.Validator(debug);
        validator.validateType('/bali/elements/Angle', '$sum', '$first', first, [
            '/bali/elements/Angle'
        ]);
        validator.validateType('/bali/elements/Angle', '$sum', '$second', second, [
            '/bali/elements/Angle'
        ]);
    }
    const calculator = new utilities.Calculator(debug);
    return new Angle(calculator.sum(first.getValue(), second.getValue()), first.getParameters(), debug);
};


/**
 * This function returns the difference of two angles. The result will be normalized to be in
 * the range (-π..π].
 *
 * @param {Angle} first The angle to be subtracted from.
 * @param {Angle} second The angle to subtract from the first angle.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Angle} The normalized difference of the two angles.
 */
Angle.difference = function(first, second, debug) {
    if (debug > 1) {
        const validator = new utilities.Validator(debug);
        validator.validateType('/bali/elements/Angle', '$difference', '$first', first, [
            '/bali/elements/Angle'
        ]);
        validator.validateType('/bali/elements/Angle', '$difference', '$second', second, [
            '/bali/elements/Angle'
        ]);
    }
    const calculator = new utilities.Calculator(debug);
    return new Angle(calculator.difference(first.getValue(), second.getValue()), first.getParameters(), debug);
};


/**
 * This function returns the specified angle scaled to the specified factor. The result
 * will be normalized to be in the range (-π..π].
 *
 * @param {Angle} angle The angle to be scaled.
 * @param {Number} factor The scale factor.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Angle} The normalized scaled angle.
 */
Angle.scaled = function(angle, factor, debug) {
    if (debug > 1) {
        const validator = new utilities.Validator(debug);
        validator.validateType('/bali/elements/Angle', '$scaled', '$angle', angle, [
            '/bali/elements/Angle'
        ]);
        validator.validateType('/bali/elements/Angle', '$scaled', '$factor', factor, [
            '/javascript/Number'
        ]);
    }
    const calculator = new utilities.Calculator(debug);
    return new Angle(calculator.product(angle.getValue(), factor), angle.getParameters(), debug);
};


/**
/**
 * This function returns the sine (opposite/hypotenuse) of an angle.
 *
 * @param {Angle} angle The angle to be analyzed.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Number} The ratio of the opposite to the hypotenuse for the angle.
 */
Angle.sine = function(angle, debug) {
    if (debug > 1) {
        const validator = new utilities.Validator(debug);
        validator.validateType('/bali/elements/Angle', '$sine', '$angle', angle, [
            '/bali/elements/Angle'
        ]);
    }
    const calculator = new utilities.Calculator(debug);
    return calculator.sine(angle.getValue());
};


/**
 * This function returns the cosine (adjacent/hypotenuse) of an angle.
 *
 * @param {Angle} angle The angle to be analyzed.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Number} The ratio of the adjacent to the hypotenuse for the angle.
 */
Angle.cosine = function(angle, debug) {
    if (debug > 1) {
        const validator = new utilities.Validator(debug);
        validator.validateType('/bali/elements/Angle', '$cosine', '$angle', angle, [
            '/bali/elements/Angle'
        ]);
    }
    const calculator = new utilities.Calculator(debug);
    return calculator.cosine(angle.getValue());
};


/**
 * This function returns the tangent (opposite/adjacent) of an angle.
 *
 * @param {Angle} angle The angle to be analyzed.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Number} The ratio of the opposite to the adjacent for the angle.
 */
Angle.tangent = function(angle, debug) {
    if (debug > 1) {
        const validator = new utilities.Validator(debug);
        validator.validateType('/bali/elements/Angle', '$tangent', '$angle', angle, [
            '/bali/elements/Angle'
        ]);
    }
    const calculator = new utilities.Calculator(debug);
    return calculator.tangent(angle.getValue());
};


/**
 * This function returns the angle for the ratio of the opposite to the hypotenuse for
 * a right triangle.
 *
 * @param {Number} ratio The ratio of the opposite to the hypotenuse for the triangle.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Angle} The angle of the triangle.
 */
Angle.arcsine = function(ratio, debug) {
    if (debug > 1) {
        const validator = new utilities.Validator(debug);
        validator.validateType('/bali/elements/Angle', '$arcsine', '$ratio', ratio, [
            '/javascript/Number'
        ]);
    }
    const calculator = new utilities.Calculator(debug);
    return new Angle(calculator.arcsine(ratio), undefined, debug);
};


/**
 * This function returns the angle for the ratio of the adjacent to the hypotenuse for
 * a right triangle.
 *
 * @param {Number} ratio The ratio of the adjacent to the hypotenuse for the triangle.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Angle} The angle of the triangle.
 */
Angle.arccosine = function(ratio, debug) {
    if (debug > 1) {
        const validator = new utilities.Validator(debug);
        validator.validateType('/bali/elements/Angle', '$arccosine', '$ratio', ratio, [
            '/javascript/Number'
        ]);
    }
    const calculator = new utilities.Calculator(debug);
    return new Angle(calculator.arccosine(ratio), undefined, debug);
};


/**
 * This function returns the angle for the ratio of the opposite to the adjacent for
 * a right triangle.
 *
 * @param {Number} opposite The length of the side opposite the angle.
 * @param {Number} adjacent The length of the side adjacent to the angle.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Angle} The angle of the triangle.
 */
Angle.arctangent = function(opposite, adjacent, debug) {
    if (debug > 1) {
        const validator = new utilities.Validator(debug);
        validator.validateType('/bali/elements/Angle', '$arctangent', '$opposite', opposite, [
            '/javascript/Number'
        ]);
        validator.validateType('/bali/elements/Angle', '$arctangent', '$adjacent', adjacent, [
            '/javascript/Number'
        ]);
    }
    const calculator = new utilities.Calculator(debug);
    return new Angle(calculator.arctangent(opposite, adjacent), undefined, debug);
};
