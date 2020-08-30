const express = require("express");
const app = express();
const fs = require("fs");
const cors = require('cors');

app.use(cors());

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
  {
    id: 4,
    content: "Checking nodemon",
    date: "2019-06-30T19:20:14.298Z",
    important: true,
  },
];

app.use(express.json());

// My own first middleware
const requestLogger = (req, res, next) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Body:  ', req.body);
  console.log('---');
  next();
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}

app.use(requestLogger);


// First route which defines an event handler
// Two parameters: req and res
// The first contains all the information of the HTTP request
// The second defines how the request is responded to.
app.get("/", (req, res) => {
  //Express automatically sets status code to 200 and content type to text/html
  res.send("<h1>Hello, World</h1>");
});

app.get("/api/notes/", (req, res) => {
  if (notes) {
    // Express automatically sets content type to application/json
    // Express also automatically transforms data into JSON format
    res.json(notes);
  } else {
    res.status(404).end();
  }
});

// Second route which defines an event handler
app.get("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log(id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    // Express automatically sets content type to application/json
    // Express also automatically transforms data into JSON format
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/notes/:id", (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    notes = notes.filter((note) => note.id !== id);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/notes", (req, res) => {
  const body = req.body;

  if (!body.content) {
    return res.status(404).json({
      error: 'JSON content missing'
    });
  }

  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date().toISOString(),
    id: generateId()
  }

  notes = notes.concat(note);

  res.json(note);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
