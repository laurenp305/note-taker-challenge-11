const router = require("express").Router();
const {
    makeNewNote,
    deleteNote
} = require("../../lib/note");

router.get("/notes", (req, res) => {
    let results = notes;
    res.json(results);
});

router.post("/notes", (req, res) => {
    req.body.id = notes.length.toString();

    const note = makeNewNote(req.body, notes);

    res.json(note);
});

router.delete("/notes/:id", (req, res) => {
    deleteNote();
    res.json(notes);
});

module.exports = router;
