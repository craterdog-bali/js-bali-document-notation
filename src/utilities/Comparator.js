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
 * This component class implements a comparator that can be used to compare any two components
 * for their natural ordering.
 */
const types = require('./Types');


// PUBLIC CONSTRUCTORS

/**
 * This comparator class implements a natural comparison algorithm using the
 * <code>Component.comparedTo(that)</code> method.
 */
function Comparator() {
    return this;
}
Comparator.prototype.constructor = Comparator;
exports.Comparator = Comparator;


// PUBLIC METHODS

/**
 * This method determines whether or not two components are equal.
 * 
 * @param {Component} first The first component to be compared.
 * @param {Component} second The second component to be compared.
 * @returns {Boolean} Whether or not the two components are equal.
 * 
 */
Comparator.prototype.componentsAreEqual = function(first, second) {
    return this.compareComponents(first, second) === 0;
};


/**
 * This method compares two components for their natural ordering.
 * 
 * @param {Component} first The first component to be compared.
 * @param {Component} second The second component to be compared.
 * @returns {Number} -1 if first < second; 0 if first === second; and 1 if first > second.
 * 
 */
Comparator.prototype.compareComponents = function(first, second) {
    // handle undefined components
    if (first && !second) {
        return 1;  // anything is greater than nothing
    }
    if (!first && second) {
        return -1;  // nothing is less than anything
    }
    if (!first && !second) {
        return 0;  // nothing is equal to nothing
    }

    // handle boolean components
    if (typeof first === 'boolean' && typeof second === 'boolean') {
        return Math.sign(first - second);
    }
    if (first.toBoolean && typeof second === 'boolean') {
        return Math.sign(first.toBoolean() - second);
    }
    if (typeof first === 'boolean' && second.toBoolean) {
        return Math.sign(first - second.toBoolean());
    }

    // handle numeric components
    if (typeof first === 'number' && typeof second === 'number') {
        if (first.toString() === second.toString()) return 0;  // handle NaN and Infinity
        return Math.sign(first - second);
    }
    if (first.toNumber && typeof second === 'number') {
        if (first.toString() === second.toString()) return 0;  // handle NaN and Infinity
        return Math.sign(first.toNumber() - second);
    }
    if (typeof first === 'number' && second.toNumber) {
        if (first.toString() === second.toString()) return 0;  // handle NaN and Infinity
        return Math.sign(first - second.toNumber());
    }
    if (first.toNumber && second.toNumber) {
        if (first.toString() === second.toString()) return 0;  // handle NaN and Infinity
        return Math.sign(first.toNumber() - second.toNumber());
    }

    // handle string components
    if (typeof first === 'string' && typeof second === 'string') {
        return Math.sign(first.localeCompare(second));
    }
    if (types.isLiteral(first.getType()) && typeof second === 'string') {
        return Math.sign(first.toString().localeCompare(second));
    }
    if (typeof first === 'string' && types.isLiteral(second.getType())) {
        return Math.sign(first.localeCompare(second.toString()));
    }

    // handle composite components
    if (first.getIterator && second.getIterator) {
        const firstIterator = first.getIterator();
        const secondIterator = second.getIterator();
        var result = 0;
        while (result === 0 && firstIterator.hasNext() && secondIterator.hasNext()) {
            result = this.compareComponents(firstIterator.getNext(), secondIterator.getNext());
        }
        if (result !== 0) {
            return result;
        }  // found a difference
        if (firstIterator.hasNext()) {
            return 1;
        }  // the first is longer than the second
        if (secondIterator.hasNext()) {
            return -1;
        }  // the second is longer than the first
        return 0;  // they are the same length and all items are equal
    }

    // must be two elemental objects of the same type, compare their string values
    return Math.sign(first.toString().localeCompare(second.toString()));
};
