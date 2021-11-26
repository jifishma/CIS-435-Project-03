"use strict";

class Note {
    name = '';
    contents = '';

    constructor(name, contents) {
        this.name = name;
        this.contents = contents;
    }
}

module.exports = Note;