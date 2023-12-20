/*
    Author:                 Nico Samadelli
    Datum Erstellt:         20/12/2023
    Datum gelöst:           20/12/2023
    Auftrag:                Ein funktionnierendes Backen entwickeln. Es muss ein login beinhalten. 
*/

const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
//Bestimmt den Port
const port = 3000;
//Swagger


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

// Authentifizierung 
const Key = "Travis"

// Hilfe von ChatGPT (Linien: 48-82  )
// Speichert ungültige Tokens 
const invalidTokens = new Set();
// Middleware für Authentifizierung
const authenticate = (req, res, next) => {
  if (req.path === '/login') {
    // Für /login-Endpunkt keine Authentifizierung erforderlich
    next();
  } else {
    const token = req.headers.authorization;
    if (token) {
      const tokenValue = token.split(' ')[1];
      // Überprüfung, ob das Token auf der Blacklist ist
      if (invalidTokens.has(tokenValue)) {
        res.status(401).json({ error: 'Token ist nicht gültig' });
      } else {
        jwt.verify(tokenValue, Key, (err, decoded) => {
          if (err) {
            res.status(401).json({ error: 'Token ist nicht gültig' });
          } else {
            req.user = decoded.user;
            next();
          }
        });
      }
    } else {
      res.status(403).json({ error: 'Token ist nicht vorhanden' });
    }
  }
};
// DELETE /logout (Zum ausloggen)
app.delete('/logout', authenticate, (req, res) => {
  // Markiert das Token als ungültig und fügt es der Blacklist hinzu
  const tokenValue = req.headers.authorization.split(' ')[1];
  invalidTokens.add(tokenValue);
  res.status(204).end(); // Erfolgreicher Logout mit Statuscode 204
});
// POST /login (Man kriegt ein Token, wenn die Email und das Passwort stimmen.)
app.post('/login', (req, res) => {
    const{email, password} = req.body;
    if(email === 'nico.samadelli@icloud.com' && password === 'Travis') {
    const token = jwt.sign({user: email}, Key);
    res.status(200).json({token});
    } else {
          res.status(401).json({error: 'Das Passwort oder die Email sind falsch'}) // Google gefragt welcher Statuscode richtig ist
    }
});

// GET /verify (Überprüft die Gültigkeit des Tokens)
app.get("/verify", authenticate, (req, res) => {
    res.status(200).json({ message: 'Das Token ist gültig', user: req.user });
});

// GET /tasks (Listet alle Tasks auf)
app.get("/tasks",authenticate, (req, res) => {
    res.status(200).json(tasks);
});

// GET /tasks/:id (Listet alle Infos zu einer Task mit der angegebenen id auf)
app.get("/tasks/:id",authenticate, (req, res) => {
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

// Bei /POST habe ich etwas Hilfe von ChatGPT gebraucht (Linien: 131, 132, 133, 135, 136)
// POST /tasks (Fügt eine neue Task hinzu)
app.post("/tasks",authenticate, (req, res) => {
    const newTask =req.body;
// Wenn die id, titel oder die beschreibung nicht ausgefüllt sind, kommt eine Fehlermeldung.
    if (!newTask.id || !newTask.titel || !newTask.beschreibung) {
        res.status(422).json({message: "Bitte füllen sie Alles aus (id, titel, beschreibung)"});
    } else {
// Wenn alles vorhanden ist, wird die neue Task erstellt.
        tasks.push(newTask);
        res.status(201).json(newTask);
    }
});

// PUT /tasks (Verändert eine Task und gibt diese zurück)
app.put("/tasks/:id",authenticate, (req, res) => {
    const id = parseInt(req.params.id);
    const updatedTask = req.body;
    //Sucht nach der Task mit der angegebenen id und updated diese.
    const index = tasks.findIndex(b => b.id === id);

    if (index !== -1) {
        tasks[index] = updatedTask;
        res.status(200).json(updatedTask);
    } else {
        res.status(404).json({message: "Taskkonnte nicht gefunden werden"});
    }
});

// DELETE (löscht die Task mit der angegebenen id)
app.delete("/tasks/:id",authenticate, (req, res) => {
    const id = parseInt(req.params.id);
    tasks = tasks.filter(b => b.id !== id);
    res.status(204).send();
});



app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });






