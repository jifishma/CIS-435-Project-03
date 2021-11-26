"use strict";

import Note from "./proxy_modules/noteProxy.js";

const apiBase = 'notes';
const serviceUrl = `http://localhost:3000/${apiBase}`;
const NotesAPI = {};

NotesAPI.getAllNotes = () => {
    const init = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return fetch(serviceUrl, init)
        .then(response => response.json());
}

NotesAPI.getNote = (notename) => {
    const init = {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return fetch(`${serviceUrl}/${notename}`, init)
        .then(response => response.json());
}

NotesAPI.writeNote = (notename, notecontents) => {
    const note = new Note(notename, notecontents);

    const init = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(note)
    };

    return fetch(`${serviceUrl}/write`, init)
        .then(response => response.json());
}

NotesAPI.deleteNote = (noteslist) => {
    const notesList = { 'notes': [] };

    noteslist?.forEach(notename => {
        notesList.notes.push(new Note(notename));
    });

    const init = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(notesList)
    }

    return fetch(`${serviceUrl}/delete`, init)
        .then(response => response.json());
}

// function listAllNotes() {
//     getAllNotes().then(data => {   
//         const list = document.createElement("ul");

//         data.notes.forEach(note => {
//             const item = document.createElement("li");
//             item.textContent = note.name;
//             list.appendChild(item);
//         });

//         outputSpan.innerHTML = list.outerHTML;
//     });
// }

window.onload = () => {
    NotesAPI.getAllNotes().then(data => {console.log(data)});
    console.log("Notes app loaded.")
};