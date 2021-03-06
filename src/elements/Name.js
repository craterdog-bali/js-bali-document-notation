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
 * name string element.
 */
const utilities = require('../utilities');
const types = require('../types');
const Exception = require('../structures/Exception').Exception;


// PUBLIC FUNCTIONS

/**
 * This function creates a new name element using the specified value.
 *
 * @param {Array} value An array containing the identifiers of the name string.
 * @param {Object} parameters Optional parameters used to parameterize this element.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Symbol} The new name string element.
 */
const Name = function(value, parameters, debug) {
    types.Sequence.call(
        this,
        ['/bali/elements/Name'],
        [
            '/bali/interfaces/Chainable'
        ],
        parameters,
        debug
    );
    if (this.debug > 1) {
        const validator = new utilities.Validator(this.debug);
        validator.validateType('/bali/elements/Name', '$Name', '$value', value, [
            '/javascript/Array'
        ]);
    }

    if (!Array.isArray(value) || value.length === 0) {
        const exception = new Exception({
            $module: '/bali/elements/Name',
            $procedure: '$Name',
            $exception: '$invalidParameter',
            $parameter: value,
            $text: 'An invalid name value was passed to the constructor.'
        });
        if (this.debug > 0) console.error(exception.toString());
        throw exception;
    }

    // since this element is immutable the value must be read-only
    this.getValue = function() { return value.slice(); };  // return a copy

    return this;
};
Name.prototype = Object.create(types.Sequence.prototype);
Name.prototype.constructor = Name;
exports.Name = Name;


// PUBLIC METHODS

/**
 * This method accepts a visitor as part of the visitor pattern.
 *
 * @param {Visitor} visitor The visitor that wants to visit this element.
 */
Name.prototype.acceptVisitor = function(visitor) {
    visitor.visitName(this);
};


/**
 * This method returns the number of identifiers that this name string has.
 *
 * @returns {Number} The number of identifiers that this name string has.
 */
Name.prototype.getSize = function() {
    return this.getValue().length;
};


/**
 * This method returns an object that can be used to iterate over the identifiers in
 * this name string.
 * @returns {Iterator} An iterator for this name string.
 */
Name.prototype.getIterator = function() {
    const iterator = new NameIterator(this.getValue(), this.getParameters(), this.debug);
    return iterator;
};


/**
 * This method returns the identifier at the specified index from this name string.
 *
 * @param {Number} index The index of the identifier to be retrieved from this name
 * string.
 * @returns {String} The identifier at the specified index.
 */
Name.prototype.getItem = function(index) {
    if (this.debug > 1) {
        const validator = new utilities.Validator(this.debug);
        validator.validateType('/bali/elements/Name', '$getItem', '$index', index, [
            '/javascript/Number'
        ]);
    }
    index = this.normalizedIndex(index) - 1;  // zero-based indexing for JS
    return this.getValue()[index];
};


/**
 * This method returns a new name string containing the identifiers in the specified range.
 *
 * @param {Range} range A range depicting the first and last identifiers to be retrieved.
 * @returns {Name} A new name string containing the requested identifiers.
 */
Name.prototype.getItems = function(range) {
    if (this.debug > 1) {
        const validator = new utilities.Validator(this.debug);
        validator.validateType('/bali/elements/Name', '$getItems', '$range', range, [
            '/bali/elements/Range'
        ]);
    }
    const first = this.normalizedIndex(range.getFirst()) - 1;  // zero-based indexing for JS
    const last = this.normalizedIndex(range.getLast());  // slice() is exclusive of last index
    const identifiers = this.getValue().slice(first, last);
    return new Name(identifiers, this.getParameters(), this.debug);
};


// PUBLIC FUNCTIONS

/**
 * This function returns a new name string that contains the bytes from the second name
 * concatenated onto the end of the first name string.
 *
 * @param {Name} first The first name string to be operated on.
 * @param {Name} second The second name string to be operated on.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Name} The resulting name string.
 */
Name.concatenation = function(first, second, debug) {
    if (debug > 1) {
        const validator = new utilities.Validator(debug);
        validator.validateType('/bali/elements/Name', '$concatenation', '$first', first, [
            '/bali/elements/Name'
        ]);
        validator.validateType('/bali/elements/Name', '$concatenation', '$second', second, [
            '/bali/elements/Name'
        ]);
    }
    const identifiers1 = first.getValue();
    const identifiers2 = second.getValue();
    const identifiers = identifiers1.concat(identifiers2);
    return new Name(identifiers, first.getParameters(), debug);
};


// PRIVATE CLASSES

const NameIterator = function(identifiers, parameters, debug) {
    types.Iterator.call(
        this,
        ['/bali/elements/NameIterator'],
        [],
        parameters,
        debug
    );
    var slot = 0;  // the slot before the first identifier
    const size = identifiers.length;  // static so we can cache it here

    this.toStart = function() {
        slot = 0;  // the slot before the first identifier
    };

    this.toSlot = function(newSlot) {
        slot = newSlot;
    };

    this.toEnd = function() {
        slot = size;  // the slot after the last identifier
    };

    this.hasPrevious = function() {
        return slot > 0;
    };

    this.hasNext = function() {
        return slot < size;
    };

    this.getPrevious = function() {
        if (!this.hasPrevious()) return;
        return identifiers[--slot];
    };

    this.getNext = function() {
        if (!this.hasNext()) return;
        return identifiers[slot++];
    };

    return this;
};
NameIterator.prototype = Object.create(types.Iterator.prototype);
NameIterator.prototype.constructor = NameIterator;
