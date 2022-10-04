let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;

if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// currentNote is used to keep track of the note in the textarea
let currentNote = {};

//this function grabs all the notes from db
var getNotes = function() {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
};

//saves notes to db
const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });


//additional function to delete note from db (BONUS)
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

//shows current note or displays empty input 
const renderCurrentNote = () => {
  hide(saveNote);

  if (currentNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(currentNote.title);
    $noteText.val(currentNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

//display notes
var manageNoteSave = function() {
  var newNote = {
    title: $noteTitle.val(),
    text: $noteText.val()
  };

saveNote (newNote).then(function(data) {
    getAndRenderNotes(); 
    renderCurrentNote();
  });
};

//delete clicked note 
var manageNoteDelete = function(event) {
    // Prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopPropagation();

  var note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (currentNote.id === noteId) {
    currentNote = {};
  }

  deleteNote (noteId).then(function() {
    getAndRenderNotes();
    renderCurrentNote();
  });
};

// Sets the currentNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  currentNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderCurrentNote();
};

// Sets the currentNote to and empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  currentNote = {};
  renderCurrentNote();
};

const handleRenderSave = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);


getAndRenderNotes();