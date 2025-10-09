const app = document.getElementById("app");

console.log(app)

document.addEventListener('click', (ev) => {
    console.log(ev);
});

// get element button
const button = document.getElementById("click");

// get element click count display
const count = document.getElementById("count");

// get event listener button
button.addEventListener('click', () => {
    // update the click count display
    count.textContent = parseInt(count.textContent) + 1;
})
