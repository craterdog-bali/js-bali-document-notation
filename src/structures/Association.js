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
 * This structure class implements an association between a key and a value. It is used by the
 * catalog class.
 */
const utilities = require('../utilities');
const types = require('../types');


// PUBLIC FUNCTIONS

/**
 * This function creates a new key-value association.
 *
 * @param {Any} key The key of the association.
 * @param {Any} value The value associated with the key.
 * @param {Number} debug A number in the range [0..3].
 * @returns {Association} A new association.
 */
const Association = function(key, value, debug) {
    types.Structure.call(
        this,
        ['/bali/structures/Association'],
        [],
        undefined,
        debug
    );
    if (this.debug > 1) {
        const validator = new utilities.Validator(this.debug);
        validator.validateType('/bali/structures/Association', '$Association', '$key', key, [
            '/javascript/String',
            '/javascript/Boolean',
            '/javascript/Number',
            '/javascript/Array',
            '/javascript/Object',
            '/bali/types/Component'
        ]);
        validator.validateType('/bali/structures/Association', '$Association', '$value', value, [
            '/javascript/Undefined',
            '/javascript/String',
            '/javascript/Boolean',
            '/javascript/Number',
            '/javascript/Array',
            '/javascript/Object',
            '/bali/types/Component'
        ]);
    }

    // convert the arguments to components
    key = this.componentize(key, this.debug);
    value = this.componentize(value, this.debug);

    // access to this component's attributes is tightly controlled
    this.getKey = function() {
        return key;
    };

    this.getValue = function() {
        return value;
    };

    this.setValue = function(newValue) {
        if (this.debug > 1) {
            const validator = new utilities.Validator(this.debug);
            validator.validateType('/bali/structures/Association', '$setValue', '$value', value, [
                '/javascript/Undefined',
                '/javascript/String',
                '/javascript/Boolean',
                '/javascript/Number',
                '/javascript/Array',
                '/javascript/Object',
                '/bali/types/Component'
            ]);
        }
        newValue = this.componentize(newValue, this.debug);
        const oldValue = value;
        value = newValue;
        return oldValue;
    };

    this.getSubcomponent = function(element) {
        if (this.debug > 1) {
            const validator = new utilities.Validator(this.debug);
            validator.validateType('/bali/structures/Associations', '$getSubcomponent', '$element', element, [
                '/bali/types/Element'
            ]);
        }
        if (key.isEqualTo(element)) return this.getValue();
    };

    this.setSubcomponent = function(element, subcomponent) {
        if (this.debug > 1) {
            const validator = new utilities.Validator(this.debug);
            validator.validateType('/bali/structures/Associations', '$setSubcomponent', '$element', element, [
                '/bali/types/Element'
            ]);
            validator.validateType('/bali/structures/Associations', '$setSubcomponent', '$subcomponent', subcomponent, [
                '/bali/types/Component'
            ]);
        }
        if (key.isEqualTo(element)) return this.setValue(subcomponent);
    };

    return this;
};
Association.prototype = Object.create(types.Structure.prototype);
Association.prototype.constructor = Association;
exports.Association = Association;


// PUBLIC METHODS

/**
 * This method determines whether or not this structure is meaningful.
 *
 * @returns {Boolean} Whether or not this component is meaningful.
 */
Association.prototype.toBoolean = function() {
    const value = this.getValue();
    return value !== undefined && value !== null;
};


/**
 * This method accepts a visitor as part of the visitor pattern.
 *
 * @param {Visitor} visitor The visitor that wants to visit this association.
 */
Association.prototype.acceptVisitor = function(visitor) {
    visitor.visitAssociation(this);
};
