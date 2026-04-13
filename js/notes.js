const noteInput = document.getElementById("noteInput");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const noteResult = document.getElementById("noteResult");
const notesList = document.getElementById("notesList");
let notes = JSON.parse(localStorage.getItem("lumaNotes")) || [];
function renderNotes() {
  if (!notesList) return;
  notesList.innerHTML = "";
  notes.forEach(function (note) {
    const noteItem = document.createElement("div");
    noteItem.classList.add("note-item");
    noteItem.textContent = note;
    notesList.prepend(noteItem);
  });
}
if (saveNoteBtn && noteInput && noteResult && notesList) {
  saveNoteBtn.addEventListener("click", function () {
    const userText = noteInput.value.trim();
    if (userText === "") {
      noteResult.textContent = "Сначала напиши заметку";
      return;
    }
    notes.push(userText);
    localStorage.setItem("lumaNotes", JSON.stringify(notes));
    noteResult.textContent = "Заметка сохранена";
    noteInput.value = "";
    renderNotes();
  });
  renderNotes();
}