const notesRouter = require("express").Router();
const Note = require("../models/note");

// Collect all notes from db
notesRouter.get("/", (req, res) => {
    Note.find({}).then((notes) => {
      res.json(notes);
    });
  });

// Collect note by id
notesRouter.get("/:id", (req, res, next) => {
  Note.findById(req.params.id)
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((err) => next(err));
});

// POST a note that is given
notesRouter.post("/", (req, res, next) => {
  const body = req.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date().toISOString(),
  });

  note
    .save()
    .then((savedNote) => savedNote.toJSON())
    .then((savedAndFormattedNote) => {
      res.json(savedAndFormattedNote);
    })
    .catch((err) => next(err));
});

notesRouter.put("/:id", (req, res, next) => {
  const body = req.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(req.params.id, note, { new: true })
    .then((updatedNote) => {
      res.json(updatedNote);
    })
    .catch((err) => next(err));
});

// DELETE object by id
notesRouter.delete("/:id", (req, res, next) => {
  Note.findByIdAndRemove(req.params.id)
    // eslint-disable-next-line no-unused-vars
    .then((result) => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

module.exports = notesRouter;
