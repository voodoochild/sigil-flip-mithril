"use strict";

class Collection {
    constructor(items=[], keys=[]) {
        this.items = items;
        this.indexes = {};
        keys.forEach(this.addIndex.bind(this));
    }

    addIndex(key) {
        let index = {};
        
        this.items.forEach((item, i) => index[item[key]] = i);
        this.indexes[key] = index;
    }

    keys(index) {
        return Object.keys(this.indexes[index]);
    }

    item(index, key) {
        return this.items[this.indexes[index][key]];
    }
}

module.exports = Collection;
