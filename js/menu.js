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
    const activeSection = document.getElementById(targetSection);
    if (activeSection) {
      activeSection.classList.add("active-section");
    }
  });
});