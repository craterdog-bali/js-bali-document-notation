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
 * This abstract class defines the invariant methods that all sortable collections must
 * implement. A sortable collection allows the order of its items to be determined externally.
 * By default, the items will be placed in the order in which they were added to the collection.
 * Additionally, the items can be sorted in various ways depending on the desired comparison
 * function.
 */
var Composite = require('./Composite').Composite;
var Collection = require('./Collection').Collection;


// PUBLIC FUNCTIONS

/**
 * This constructor creates a new sortable collection of the specified type with the optional
 * parameters that are used to parameterize its type.
 * 
 * @param {Number} type The type of sortable collection.
 * @param {Parameters} parameters Optional parameters used to parameterize this sortable
 * collection. 
 * @returns {SortableCollection} The new sortable collection.
 */
function SortableCollection(type, parameters) {
    Collection.call(this, type, parameters);
    return this;
}
SortableCollection.prototype = Object.create(Collection.prototype);
SortableCollection.prototype.constructor = SortableCollection;
exports.SortableCollection = SortableCollection;


/**
 * This function returns a new sortable collection containing of the all the items from both
 * the specified collections.
 *
 * @param {SortableCollection} collection1 The first collection whose items are to be concatenated.
 * @param {SortableCollection} collection2 The second collection whose items are to be concatenated.
 * @returns {SortableCollection} The resulting collection.
 */
SortableCollection.concatenation = function(collection1, collection2) {
    var result = collection1.constructor.fromCollection(collection1, collection1.parameters);
    result.addItems(collection2);
    return result;
};


// PUBLIC METHODS

/**
 * This abstract method replaces an existing item in this sortable collection with a new one.
 * The new item replaces the existing item at the specified index. It must be implemented
 * by a subclass.
 *
 * @param {Number} index The index of the existing item.
 * @param {Component} item The new item that will replace the existing one.
 *
 * @returns The existing item that was at the specified index.
 */
SortableCollection.prototype.setItem = function(index, item) {
    throw new Error('COLLECTION: Abstract method setItem(index, item) must be implemented by a concrete subclass.');
};


/**
 * This abstract method adds the specified item to this sortable collection. It must be
 * implemented by a subclass.
 * 
 * @param {Component} item The item to be added to this sortable collection. 
 */
SortableCollection.prototype.addItem = function(item) {
    throw new Error('COLLECTION: Abstract method addItem(item) must be implemented by a concrete subclass.');
};


/**
 * This method adds a list of new items to this sortable collection. The new items will
 * be added in the order they appear in the specified collection.
 *
 * @param {Collection} items The list of new items to be added.
 * @returns {Number} The number of items that were actually added to this sortable collection.
 */
SortableCollection.prototype.addItems = function(items) {
    var count = 0;
    var iterator = items.iterator();
    while (iterator.hasNext()) {
        var item = iterator.getNext();
        if (this.addItem(item)) {
            count++;
        }
    }
    return count;
};


/**
 * This abstract method removes from this sortable collection the item associated with
 * the specified index. It must be implemented by a subclass.
 *
 * @param {Number} index The index of the item to be removed.
 * @returns {Component} The item at the specified index.
 */
SortableCollection.prototype.removeItem = function(index) {
    throw new Error('COLLECTION: Abstract method removeItem(index) must be implemented by a concrete subclass.');
};


/**
 * This method removes from this sortable collection the items associated with the specified
 * index range.
 *
 * @param {Number} firstIndex The index of the first item to be removed.
 * @param {Number} lastIndex The index of the last item to be removed.
 * @returns The collection of the items that were removed from this sortable collection.
 */
SortableCollection.prototype.removeItems = function(firstIndex, lastIndex) {
    firstIndex = this.normalizedIndex(firstIndex);
    lastIndex = this.normalizedIndex(lastIndex);
    var removedItems = this.constructor.fromCollection([], this.parameters);  // empty collection
    var index = firstIndex;
    while (index <= lastIndex) {
        var removedItem = this.removeItem(index++);
        if (removedItem) removedItems.addItem(removedItem);
    }
    return removedItems;
};


/**
 * This method shuffles the items in this sortable collection using a randomizing algorithm.
 */
SortableCollection.prototype.shuffleItems = function() {
    var sorter = new RandomSorter();
    sorter.sortCollection(this);
};


/**
 * This method sorts the items in this sortable collection into their natural order as defined
 * by the <code>this.comparedTo(that)</code> method of the items being compared.
 */
SortableCollection.prototype.sortItems = function() {
    var sorter = new MergeSorter();
    sorter.sortCollection(this);
};


// PRIVATE HELPER CLASSES

/*
 * This sorter class implements a standard merge sort algorithm.  The collection to be sorted
 * is recursively split into two collections each of which are then sorted and then the two
 * collections are merged back into a sorted collection.
 */

function MergeSorter() {
    return this;
}
MergeSorter.prototype.constructor = MergeSorter;


MergeSorter.prototype.sortCollection = function(collection) {
    if (collection && collection.getSize() > 1) {
        // convert the collection to an array
        var array = [];
        var iterator = collection.iterator();
        while (iterator.hasNext()) {
            var item = iterator.getNext();
            array.push(item);
        }

        // sort the array
        array = this.sortArray(array);

        // convert it back to a collection
        collection.removeAll();
        collection.addItems(array);
    }
};


MergeSorter.prototype.sortArray = function(array) {
    // check to see if the array is already sorted
    var length = array.length;
    if (length < 2) return;

    // split the array into two halves
    var leftLength = Math.floor(length / 2);
    var left = array.slice(0, leftLength);
    var right = array.slice(leftLength, length);

    // sort each half separately
    left = this.sortArray(left);
    right = this.sortArray(right);

    // merge the sorted halves back together
    var result = this.mergeArrays(left, right);
    return result;
};


MergeSorter.prototype.mergeArrays = function(left, right) {
    var leftIndex = 0;
    var rightIndex = 0;
    var result = [];
    while (leftIndex < left.length && rightIndex < right.length) {
        // still have elements in both halves
        switch (Composite.compareItems(left[leftIndex], right[rightIndex])) {
            case -1:
                // copy the next left element to the result
                result.push(left[leftIndex++]);
                break;
            case 0:
            case 1:
                // copy the next right element to the result
                result.push(right[rightIndex++]);
                break;
        }
    }
    if (leftIndex < left.length) {
        // copy the rest of the left half to the result
        result = result.concat(left.slice(leftIndex));
    } else {
        // copy the rest of the right half to the result
        result = result.concat(right.slice(rightIndex));
    }
    return result;
};


/*
 * This sorter class implements a randomizing sort algorithm.  The collection to be sorted
 * is randomly reordered such that the resulting order is relatively random.
 */

function RandomSorter() {
    return this;
}
RandomSorter.prototype.constructor = RandomSorter;


RandomSorter.prototype.sortCollection = function(collection) {
    if (collection && collection.getSize() > 1) {
        // convert the collection to an array
        var array = [];
        var iterator = collection.iterator();
        while (iterator.hasNext()) {
            var item = iterator.getNext();
            array.push(item);
        }

        // randomize the array
        array = this.randomizeArray(array);

        // convert it back to a collection
        collection.removeAll();
        collection.addItems(array);
    }
};


RandomSorter.prototype.randomizeArray = function(array) {
    var size = array.length;
    for (var index = size; index > 1; index--) {
        var randomIndex = Math.floor(Math.random() * index);  // use zero based indexing
        var swap = array[index - 1];
        array[index - 1] = array[randomIndex];
        array[randomIndex] = swap;
    }
    return array;
};