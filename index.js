/*
    Author:     Nico Samadelli
    Datum:      20/12/2023
    Auftrag:    Backend entwickeln.
*/

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
//Bestimmt den Port
const port = 3000;
//Swagger
const swaggerUi = require('swagger-ui-express');
const swaggerAutogen = require('swagger-autogen')();

app.use(bodyParser.json());

// Hier stehen alle Tasks
let tasks = [
    // Task 1
    {
        id: 1,
        titel: "Einkaufen gehen",
        beschreibung: "4 Birnen, 2 Äpfel, 1 Blätterteig, 1kg Zucker, 1kg Mehl"
    },

    // Task 2
    {
        id: 2,
        titel: "MTG Bestellung machen",
        beschreibung: "4 Cloudpost, 4 Glimmerpost, 2 Terminate, 1 Emrakul, the Aeons Torn"
    },

    // Task 3
    {
        id: 3,
        titel: "Französisch Voci lernen",
        beschreibung: "Die 150 Vocis auf Quizlet lernen"
    },
    // Hier kann man weitere Tasks hinzufügen...
]

// GET /tasks (Listet alle Tasks auf)
app.get("/tasks", req, res => {
    res.status(200).json(tasks);
});

// GET /tasks/:id (Listet alle Infos zu einer Task mit der angegebenen id auf)
app.get("/tasks/:id", req, res => {
    const id = req.params.id;
    const task = tasks.find(b => b.id === id);

    if (task) {
// Wenn die Task gefunden wird, wird sie ausgegeben.
        res.status(200).json(task);
    } else { 
// Wenn die Task nicht gefunden wird, wird ein Fehler ausgegeben.
        res.status(404).json({message: "Task konnte nicht gefunden werden"});
    }
});

// POST /tasks (Fügt einen neue Task hinzu)
app.post("/tasks", (req, res) => {
    const newTask =req.body;
// Wenn die id, titel oder die beschreibung nicht ausgefüllt sind, kommt eine Fehlermeldung.
    if (!newTask.id || !newTask.titel || !newTask.beschreibung) {
        res.status(422).json({message: "Bitte füllen sie Alles aus (id, titel, beschreibung)"});
    } else {
// Wenn alles vorhanden ist, wird die neue Task erstellt.
        app.push(newTask);
        res.status(201).json(newTask);
    }
});

// PUT /tasks (Verändert eine Task und gibt diese zurück)
app.put("/tasks/:id", (req, res) => {
    const id = req.params.id
    const updatedTask = req.body
    //Sucht nach der Task mit der angegebenen id und updated diese.
    const index = tasks.findIndex(b => b.id === id);

    if (index !== -1) {
        tasks[index] = updatedTask;
        res.status(200).json(updatedTask);
    } else {
        res.status(404).json({message: "Taskkonnte nicht gefunden werden"});
    }
});













