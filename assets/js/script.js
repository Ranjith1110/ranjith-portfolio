const header = document.querySelector("#navbar");

window.addEventListener("scroll", function() {
    navbar.classList.toggle("sticky", window.scrollY > 200);
});

let menu = document.querySelector('.menu-icon');
let slider = document.querySelector('.slider');
let icon = document.querySelectorAll('.slider li');
menu.onclick = () => {
    // menu.classList.toggle('menu-icon');
    slider.classList.toggle('active');
}

icon.forEach(icons => {
    icons.onclick = () => {
        slider.classList.toggle('active');
    }
});
