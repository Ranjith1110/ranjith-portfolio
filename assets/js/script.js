let menu = document.querySelector('.menu-icon');
let slider = document.querySelector('.slider');
let icon = document.querySelectorAll('.slider a');
menu.onclick = () => {
    slider.classList.toggle('active');
}

icon.forEach(icons => {
    icons.onclick = () => {
        slider.classList.toggle('active');
    }
});
