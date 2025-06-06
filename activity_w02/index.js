const countdown = document.getElementById('countdown');
const startbtn = document.getElementById('startButton');

let time = 10;

startbtn.addEventListener('click', () => {
    setInterval(() => {
        if (time >= 0 ) {
            countdown.textContent = time;
            time--;
        } else {
            countdown.textContent = 'countdown is over';
        }
    }, 1000)
})