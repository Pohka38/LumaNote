const menuItems = document.querySelectorAll(".menu-item");
const sections = document.querySelectorAll(".page-section");
function showSection(sectionId) {
  menuItems.forEach(function (menuItem) {
    menuItem.classList.remove("active");
  });
  sections.forEach(function (section) {
    section.classList.remove("active-section");
  });
  const activeMenuItem = document.querySelector(`[data-section="${sectionId}"]`);
  const activeSection = document.getElementById(sectionId);
  if (activeMenuItem) {
    activeMenuItem.classList.add("active");
  }
  if (activeSection) {
    activeSection.classList.add("active-section");
  }
}
menuItems.forEach(function (item) {
  item.addEventListener("click", function () {
    const targetSection = item.getAttribute("data-section");
    showSection(targetSection);
    localStorage.setItem("lumaActiveSection", targetSection);
  });
});
const savedSection = localStorage.getItem("lumaActiveSection");
if (savedSection) {
  showSection(savedSection);
} else {
  showSection("home");
}