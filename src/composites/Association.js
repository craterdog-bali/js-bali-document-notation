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

/**
 * This composite class implements an association between a key and a value. It is used by the
 * catalog class.
 */
const utilities = require('../utilities');
const abstractions = require('../abstractions');


// PUBLIC FUNCTIONS

/**
 * This constructor creates a new key-value association.
 * 
 * @param {String|Number|Boolean|Component} key The key of the association.
 * @param {String|Number|Boolean|Component} value The value associated with the key.
 * @returns {Association} A new association.
 */
function Association(key, value) {
    abstractions.Composite.call(this, utilities.types.ASSOCIATION);
    if (this.convert) {
        key = this.convert(key);
        value = this.convert(value);
    }
    this.key = key;
    this.value = value;
    return this;
}
Association.prototype = Object.create(abstractions.Composite.prototype);
Association.prototype.constructor = Association;
exports.Association = Association;


// PUBLIC METHODS

/**
 * This method returns an array containing the attributes of this association.
 * 
 * @returns {Array} An array containing the attributes of this association.
 */
Association.prototype.toArray = function() {
    const array = [];
    array.push(this.key);
    array.push(this.value);
    return array;
};


/**
 * This method accepts a visitor as part of the visitor pattern.
 * 
 * @param {Visitor} visitor The visitor that wants to visit this association.
 */
Association.prototype.acceptVisitor = function(visitor) {
    visitor.visitAssociation(this);
};


/**
 * This method returns the number of 
 * 
 * @returns {Number} The number of attributes that make up this composite component.
 */
Association.prototype.getSize = function() {
    return 2;
};


/**
 * This method sets a new value for this association.
 * 
 * @param {String|Component} value The value of this association.
 * @returns {Component} The value previously associated with the key.
 */
Association.prototype.setValue = function(value) {
    if (this.convert) value = this.convert(value);
    const oldValue = this.value;
    this.value = value;
    return oldValue;
};
