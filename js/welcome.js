const startBtn = document.getElementById("startBtn");
const message = document.getElementById("message");
if (startBtn && message) {
  startBtn.addEventListener("click", function () {
    message.textContent = "Ты вошёл в проект будущего";
  });
}