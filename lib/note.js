const fs = require("fs");
const path = require("path");

function makeNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, "../db/db.json"),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
  return note;
}

function deleteNote() {
  let deleteId = parseInt(req.params.id);
  notesArray.splice(deleteId, 1);

  for (let i = 0; i < notesArray.length; i++) {
    notesArray[i].id = i;
  }

  fs.writeFileSync(
    path.join(__dirname, "../db/db.json"),
    JSON.stringify({ notes: notesArray }, null, 2)
  );
}

module.exports = {
    makeNewNote,
    deleteNote
};
