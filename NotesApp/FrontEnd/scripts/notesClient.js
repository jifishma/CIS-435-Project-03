'use strict';

import Note from './proxy_modules/noteProxy.js';

let usernameField;
let noteContentsField;
let noteSubmitWarning;
let notesFlexgrid;
let noteEditor;

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

NotesAPI.deleteNotes = (noteslist) => {
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

function createNoteItem(name, contents) {
    // console.log(name + ', ' + contents);

    const item = document.createElement('div');
    item.classList.add('flex-item')

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = name;

    const contentOrganizer = document.createElement('div');
    contentOrganizer.onclick = () => showNoteEditor(name, contents);
    
    const noteContent = document.createElement('p');
    noteContent.classList.add('flex-content');
    
    let text = contents;
    if (text && text.length > 80) {
        text = text.substring(0, 79) + '...';
    }
    noteContent.textContent = text ?? '\u00A0';

    const noteAuthor = document.createElement('p');
    noteAuthor.classList.add('flex-footer');
    noteAuthor.textContent = name ?? '\u00A0';

    contentOrganizer.appendChild(noteContent);
    contentOrganizer.appendChild(noteAuthor);
    item.appendChild(checkbox);
    item.appendChild(contentOrganizer);

    return item;
}

function listAllNotes() {
    NotesAPI.getAllNotes().then(data => {  
        notesFlexgrid.innerHTML = '';
        
        if (!data.notes.length) {
            noNotesMessage.classList.add('visible');
            return;
        }

        noNotesMessage.classList.remove('visible');

        data.notes.forEach(n => {
            NotesAPI.getNote(n.name).then(note => {
                const noteItem = createNoteItem(note.name, note.contents);
                notesFlexgrid.appendChild(noteItem);
            });
        });
    });
}

function showNoteEditor(noteName, noteContents) { 
    // console.log(noteName, noteContents);

    usernameField.focus();
    if (!noteName) {
        usernameField.value = '';
        noteContentsField.value = '';
    } else {
        usernameField.value = noteName;
        noteContentsField.value = noteContents;
    }

    noteEditor.classList.add('visible');
}

function hideNoteEditor() {
    noteEditor.classList.remove('visible');
}

function deleteSelectedNotes() {
    const checkedNotes = notesFlexgrid.querySelectorAll('input[type="checkbox"]:checked');
    const notesToDelete = []
    
    checkedNotes.forEach(note => {
        notesToDelete.push(note.id);
    })

    console.log(notesToDelete);
    NotesAPI.deleteNotes(notesToDelete);
    listAllNotes();
}

function writeNote() {
    if (!noteContentsField.checkValidity() || !usernameField.checkValidity()) {
        noteSubmitWarning.classList.add('visible');
        return;
    } 

    noteSubmitWarning.classList.remove('visible');

    const username = usernameField.value;
    const noteContent = noteContentsField.value;

    NotesAPI.writeNote(username, noteContent);

    listAllNotes();
    hideNoteEditor();
}

window.onload = () => {
    usernameField = document.querySelector('#username');
    noteContentsField = document.querySelector('#notecontents');
    noteSubmitWarning = document.querySelector('#noteSubmitWarning');
    notesFlexgrid = document.querySelector("#notesList");
    noteEditor = document.querySelector('#noteEditor');

    const createButton = document.querySelector('#createButton');
    createButton.onclick = () => showNoteEditor(null);

    const deleteButton = document.querySelector('#deleteButton');
    deleteButton.onclick = deleteSelectedNotes;
    
    const closeButton = document.querySelector('#modalCloseButton');
    closeButton.onclick = hideNoteEditor;
    
    const writeButton = document.querySelector('#modalWriteButton');
    writeButton.onclick = writeNote;
    
    listAllNotes();
    console.log('Notes app loaded.')
};