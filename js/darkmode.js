let darkMode = localStorage.getItem("darkMode");
if (darkMode == "true") {
    addDarkMode();
}
document.querySelector(".switch").addEventListener("click", function () {
    darkMode = localStorage.getItem("darkMode");
    if (darkMode == "true") {
        removeDarkMode();
    } else {
        addDarkMode();
    }
});
function addDarkMode() {
    console.log('darkmode on')
    darkMode = localStorage.setItem("darkMode", "true");
    document.getElementsByTagName("body")[0].classList.add("darkMode");
    var menuTitle = document.querySelectorAll('.menuTitle')
    console.log(' menu-title', menuTitle)
    for (let i = 0; i < menuTitle.length; i++) {
        menuTitle[i].style.color = 'black';
    }
}
function removeDarkMode() {
    console.log('darkmode off')
    darkMode = localStorage.setItem("darkMode", "false");
    document.getElementsByTagName("body")[0].classList.remove("darkMode");
    var menuTitle = document.querySelectorAll('.menuTitle')
    console.log(' menu-title', menuTitle)
    for (let i = 0; i < menuTitle.length; i++) {
        menuTitle[i].style.color = '';
    }
}