const taskInput = document.getElementById("taskInput");
const taskDateInput = document.getElementById("taskDateInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskResult = document.getElementById("taskResult");
const tasksList = document.getElementById("tasksList");
let tasks = JSON.parse(localStorage.getItem("lumaTasks")) || [];
function saveTasksToStorage() {
  localStorage.setItem("lumaTasks", JSON.stringify(tasks));
}
function formatTaskDate(dateString) {
  if (!dateString) return "Без даты";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}
function getDaysLeft(dateString) {
  if (!dateString) return null;
  const today = new Date();
  const target = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const diffMs = target - today;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}
function getTaskStatusText(task) {
  if (task.completed) {
    return "Статус: выполнено";
  }
  const daysLeft = getDaysLeft(task.date);
  if (daysLeft === null) {
    return "Статус: без даты";
  }
  if (daysLeft < 0) {
    return "Статус: просрочено";
  }
  if (daysLeft === 0) {
    return "Статус: на сегодня";
  }
  if (daysLeft === 1) {
    return "Остался 1 день";
  }
  if (daysLeft >= 2 && daysLeft <= 4) {
    return `Осталось ${daysLeft} дня`;
  }
  return `Осталось ${daysLeft} дней`;
}
function renderTasks() {
  if (!tasksList) return;
  tasksList.innerHTML = "";
  const reversedTasks = [...tasks].reverse();
  reversedTasks.forEach(function (task, index) {
    const realIndex = tasks.length - 1 - index;
    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");
    const daysLeft = getDaysLeft(task.date);
    if (task.completed) {
      taskItem.classList.add("completed-task");
    } else if (daysLeft !== null && daysLeft < 0) {
      taskItem.classList.add("overdue-task");
    }
    const taskText = document.createElement("div");
    taskText.classList.add("task-text");
    taskText.textContent = task.text;
    const taskMeta = document.createElement("div");
    taskMeta.classList.add("task-meta");
    taskMeta.textContent = `Дата: ${formatTaskDate(task.date)} | ${getTaskStatusText(task)}`;
    const taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");
    const completeBtn = document.createElement("button");
    completeBtn.classList.add("complete-btn");
    completeBtn.textContent = task.completed ? "Вернуть" : "Выполнено";
    completeBtn.addEventListener("click", function () {
      tasks[realIndex].completed = !tasks[realIndex].completed;
      saveTasksToStorage();
      renderTasks();
    });
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Удалить";

    deleteBtn.addEventListener("click", function () {
      tasks.splice(realIndex, 1);
      saveTasksToStorage();
      renderTasks();
    });
    taskActions.appendChild(completeBtn);
    taskActions.appendChild(deleteBtn);
    taskItem.appendChild(taskText);
    taskItem.appendChild(taskMeta);
    taskItem.appendChild(taskActions);
    tasksList.appendChild(taskItem);
  });
}
function addTask() {
  if (!taskInput || !taskDateInput || !taskResult || !tasksList) return;
  const userTask = taskInput.value.trim();
  const userDate = taskDateInput.value;
  if (userTask === "") {
    taskResult.textContent = "Сначала напиши задачу";
    return;
  }
  const newTask = {
    text: userTask,
    date: userDate,
    completed: false
  };
  tasks.push(newTask);
  saveTasksToStorage();
  taskResult.textContent = "Задача добавлена";
  taskInput.value = "";
  taskDateInput.value = "";
  taskInput.focus();
  renderTasks();
}
if (addTaskBtn && taskInput && taskDateInput && taskResult && tasksList) {
  addTaskBtn.addEventListener("click", function () {
    addTask();
  });
  taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTask();
    }
  });
  renderTasks();
}