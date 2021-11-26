const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const fs = require('fs');
const Note = require('./custom_modules/NoteModule');

const app = express();
const portNum = 3000;
const urlPath = "/notes";
const storageFolder = './UserNotes/';

app.use(cors());
app.use(express.json());

// List all notes available.
app.get(`${urlPath}`, (req, res) => {
    const notesList = [];

    if (fs.existsSync(storageFolder)) {
        fs.readdirSync(storageFolder).forEach(relativepath => {
            const notename = relativepath.substring(0, relativepath.lastIndexOf('.txt'));
            notesList.push(new Note(notename));
        });
    }

    res.contentType('json')
        .send(JSON.stringify({notes: notesList}));
});

// Read a specified note's contents.
app.get(`${urlPath}/:notename`, (req, res) => {
    const note = new Note(req.params.notename);
    const notepath = storageFolder + note.name + '.txt';

    if (fs.existsSync(notepath)) {
        note.contents = fs.readFileSync(notepath, 'utf8');
    }

    res.contentType('json')
        .send(JSON.stringify(note));
});

// Create notes as passed through body.
app.post(`${urlPath}/write`, (req, res) => {
    if (!fs.existsSync(storageFolder))
        fs.mkdirSync(storageFolder);
    
    const note = new Note(req.body.name, req.body.contents);
    const notepath = storageFolder + note.name + '.txt';

    fs.writeFileSync(notepath, note.contents);

    res.contentType('json')
        .status(201)
        .send(JSON.stringify(note))
});

// Delete notes passed through body.
app.post(`${urlPath}/delete`, (req, res) => {
    const notesList = [];

    req.body.notes?.forEach(note => {
        const notePath = storageFolder + note.name + '.txt';
        if (fs.existsSync(notePath)) {
            fs.rmSync(notePath);
            notesList.push(note);
        }
    });

    res.contentType('json')
        .send(JSON.stringify({notes: notesList}));
});

app.listen(portNum, () => {
    console.log(`listening on port ${portNum}`);
});