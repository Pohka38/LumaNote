    const startBtn = document.getElementById("startBtn");
    const message = document.getElementById("message");
    startBtn.addEventListener("click", function () {
      message.textContent = "Ты вошёл в проект будущего";
    });
const noteInput = document.getElementById("noteInput");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const noteResult = document.getElementById("noteResult");
const notesList = document.getElementById("notesList");
let notes = JSON.parse(localStorage.getItem("lumaNotes")) || [];
function renderNotes() {
  notesList.innerHTML = "";
  notes.forEach(function (note) {
    const noteItem = document.createElement("div");
    noteItem.classList.add("note-item");
    noteItem.textContent = note;
    notesList.prepend(noteItem);
  });
}
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
    const clock = document.getElementById("clock");
    function updateClock() {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      clock.textContent = `${hours}:${minutes}:${seconds}`;
    }
    updateClock();
    setInterval(updateClock, 1000);
    const menuItems = document.querySelectorAll(".menu-item");
    const sections = document.querySelectorAll(".page-section");
    menuItems.forEach(function (item) {
      item.addEventListener("click", function () {
        const targetSection = item.getAttribute("data-section");
        menuItems.forEach(function (menuItem) {
          menuItem.classList.remove("active");
        });
        item.classList.add("active");
        sections.forEach(function (section) {
          section.classList.remove("active-section");
        });
        document.getElementById(targetSection).classList.add("active-section");
      });
    });