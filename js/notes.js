const searchNotesInput = document.getElementById("searchNotesInput");
const noteTitleInput = document.getElementById("noteTitleInput");
const noteInput = document.getElementById("noteInput");
const saveNoteBtn = document.getElementById("saveNoteBtn");
const noteResult = document.getElementById("noteResult");
const notesList = document.getElementById("notesList");
let notes = JSON.parse(localStorage.getItem("lumaNotes")) || [];
let draggedIndex = null;
function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}
function formatTime(date) {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}
function normalizeNote(note, index = 0) {
  if (typeof note === "string") {
    return {
      title: "Без заголовка",
      text: note,
      date: "Старая заметка",
      time: "",
      editedDate: "",
      editedTime: "",
      pinned: false,
      order: index
    };
  }
  return {
    title: note.title || "Без заголовка",
    text: note.text || "",
    date: note.date || "Без даты",
    time: note.time || "",
    editedDate: note.editedDate || "",
    editedTime: note.editedTime || "",
    pinned: note.pinned || false,
    order: typeof note.order === "number" ? note.order : index
  };
}
function saveNotesToStorage() {
  localStorage.setItem("lumaNotes", JSON.stringify(notes));
}
function getVisibleNotes() {
  let preparedNotes = notes.map(function (note, index) {
    return {
      originalIndex: index,
      data: normalizeNote(note, index)
    };
  });
  if (searchNotesInput && searchNotesInput.value.trim() !== "") {
    const query = searchNotesInput.value.toLowerCase();
    preparedNotes = preparedNotes.filter(function (item) {
      return (
        item.data.title.toLowerCase().includes(query) ||
        item.data.text.toLowerCase().includes(query)
      );
    });
  }
  preparedNotes.sort(function (a, b) {
    if (a.data.pinned !== b.data.pinned) {
      return Number(b.data.pinned) - Number(a.data.pinned);
    }
    return a.data.order - b.data.order;
  });
  return preparedNotes;
}
function renderNotes() {
  if (!notesList) return;
  notesList.innerHTML = "";
  const visibleNotes = getVisibleNotes();
  visibleNotes.forEach(function (item) {
    const normalized = item.data;
    const realIndex = item.originalIndex;
    const noteItem = document.createElement("div");
    noteItem.classList.add("note-item");
    noteItem.setAttribute("draggable", "true");
    noteItem.dataset.index = String(realIndex);
    if (normalized.pinned) {
      noteItem.classList.add("pinned-note");
    }
    noteItem.addEventListener("dragstart", function () {
      draggedIndex = realIndex;
      noteItem.classList.add("dragging");
    });
    noteItem.addEventListener("dragend", function () {
      draggedIndex = null;
      noteItem.classList.remove("dragging");
    });
    noteItem.addEventListener("dragover", function (event) {
      event.preventDefault();
    });
    noteItem.addEventListener("drop", function (event) {
      event.preventDefault();
      const targetIndex = Number(noteItem.dataset.index);

      if (draggedIndex === null || draggedIndex === targetIndex) {
        return;
      }
      const draggedNote = normalizeNote(notes[draggedIndex], draggedIndex);
      const targetNote = normalizeNote(notes[targetIndex], targetIndex);
      if (draggedNote.pinned !== targetNote.pinned) {
        alert("Нельзя перемещать заметки между закреплёнными и обычными");
        return;
      }
      const draggedOrder = draggedNote.order;
      const targetOrder = targetNote.order;
      notes[draggedIndex] = {
        ...notes[draggedIndex],
        order: targetOrder
      };
      notes[targetIndex] = {
        ...notes[targetIndex],
        order: draggedOrder
      };
      saveNotesToStorage();
      renderNotes();
    });
    const noteTitle = document.createElement("div");
    noteTitle.classList.add("note-title");
    noteTitle.textContent = normalized.pinned
      ? `📌 ${normalized.title}`
      : normalized.title;
    const noteText = document.createElement("div");
    noteText.classList.add("note-text");
    noteText.textContent = normalized.text;
    const noteMeta = document.createElement("div");
    noteMeta.classList.add("note-meta");
    let metaText = normalized.time
      ? `Создано: ${normalized.date} • ${normalized.time}`
      : `Создано: ${normalized.date}`;
    if (normalized.editedDate) {
      metaText += normalized.editedTime
        ? ` | Изменено: ${normalized.editedDate} • ${normalized.editedTime}`
        : ` | Изменено: ${normalized.editedDate}`;
    }
    noteMeta.textContent = metaText;
    const actions = document.createElement("div");
    actions.classList.add("note-actions");
    const pinBtn = document.createElement("button");
    pinBtn.classList.add("pin-btn");
    pinBtn.textContent = normalized.pinned ? "Открепить" : "Закрепить";
    pinBtn.addEventListener("click", function () {
      notes[realIndex] = {
        ...normalized,
        pinned: !normalized.pinned
      };
      saveNotesToStorage();
      renderNotes();
    });
    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-btn");
    editBtn.textContent = "Редактировать";
      editBtn.addEventListener("click", function () {
      const titleEditInput = document.createElement("input");
      titleEditInput.type = "text";
      titleEditInput.value = normalized.title;
      titleEditInput.classList.add("edit-input");
      titleEditInput.spellcheck = false;
      titleEditInput.autocomplete = "off";
      const textEditInput = document.createElement("textarea");
      textEditInput.value = normalized.text;
      textEditInput.classList.add("edit-textarea");
      textEditInput.spellcheck = false;
      textEditInput.autocomplete = "off";
       const saveBtn = document.createElement("button");
        saveBtn.textContent = "Сохранить";
        saveBtn.classList.add("save-btn");
        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Отмена";
        cancelBtn.classList.add("cancel-btn");
        editBtn.style.display = "none";
        pinBtn.style.display = "none";
        deleteBtn.style.display = "none";
        noteItem.replaceChild(titleEditInput, noteTitle);
        noteItem.classList.add("editing-note");
        noteItem.replaceChild(textEditInput, noteText);
        actions.appendChild(saveBtn);
        actions.appendChild(cancelBtn);
        titleEditInput.focus();
        function saveEditedNote() {
          const updatedTitle = titleEditInput.value.trim();
          const updatedText = textEditInput.value.trim();
          if (updatedTitle === "" || updatedText === "") {
            alert("Заголовок и текст заметки не могут быть пустыми");
            return;
          }
          const now = new Date();
          notes[realIndex] = {
            ...normalized,
            title: updatedTitle,
            text: updatedText,
            editedDate: formatDate(now),
            editedTime: formatTime(now)
          };
          saveNotesToStorage();
          renderNotes();
        }
        saveBtn.addEventListener("click", function () {
          saveEditedNote();
        });
        cancelBtn.addEventListener("click", function () {
          renderNotes();
        });
      titleEditInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();
          saveEditedNote();
        }
        if (event.key === "Escape") {
          renderNotes();
        }
      });
      textEditInput.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
          renderNotes();
        }
        if (event.key === "Enter" && event.ctrlKey) {
          event.preventDefault();
          saveEditedNote();
        }
      });
    });
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Удалить";
    deleteBtn.addEventListener("click", function () {
      notes.splice(realIndex, 1);
      saveNotesToStorage();
      notes = notes.map(function (note, index) {
        const normalizedNote = normalizeNote(note, index);
        return {
          ...normalizedNote,
          order: index
        };
      });
      saveNotesToStorage();
      renderNotes();
    });
    actions.appendChild(pinBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    noteItem.appendChild(noteTitle);
    noteItem.appendChild(noteText);
    noteItem.appendChild(noteMeta);
    noteItem.appendChild(actions);
    notesList.appendChild(noteItem);
  });
}
function saveNote() {
  if (!noteTitleInput || !noteInput || !noteResult || !notesList) return;
  const userTitle = noteTitleInput.value.trim();
  const userText = noteInput.value.trim();
  if (userTitle === "" || userText === "") {
    noteResult.textContent = "Сначала заполни заголовок и текст заметки";
    return;
  }
  const now = new Date();
  const newNote = {
    title: userTitle,
    text: userText,
    date: formatDate(now),
    time: formatTime(now),
    editedDate: "",
    editedTime: "",
    pinned: false,
    order: notes.length
  };
  notes.push(newNote);
  saveNotesToStorage();
  noteResult.textContent = "Заметка сохранена";
  noteTitleInput.value = "";
  noteInput.value = "";
  noteTitleInput.focus();
  renderNotes();
}
if (saveNoteBtn && noteTitleInput && noteInput && noteResult && notesList) {
  saveNoteBtn.addEventListener("click", function () {
    saveNote();
  });
  noteTitleInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      saveNote();
    }
  });
  noteInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && event.ctrlKey) {
      event.preventDefault();
      saveNote();
    }
  });
  renderNotes();
}
if (searchNotesInput) {
  searchNotesInput.addEventListener("input", function () {
    renderNotes();
  });
}