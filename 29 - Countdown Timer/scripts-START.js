const timers = document.querySelectorAll('[data-time]');
const timeLeft = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');

timers.forEach(timer => timer.addEventListener('click', handleTimerClick));

let countdownClock;
let finish;

function handleTimerClick(evt){
    setTimer(parseInt(this.dataset.time));
}

function setTimer(seconds){
    clearInterval(countdownClock);
    const now = Date.now();
    finish = now + (seconds * 1000);
    displayTime(seconds);
    displayEndTime(finish);
    countdownClock =  setInterval(() => {
        const elapsed = Math.round((finish - Date.now())/1000);
        if (elapsed < 0){
            clearInterval(countdownClock);
            return;
        }
        displayTime(elapsed);
    }, 1000);
}
function displayTime(elapsed){
    const minutes = Math.floor(elapsed/60);
    const seconds = Math.floor(elapsed) % 60;
    timeLeft.textContent = `${minutes}:${seconds < 10 ? '0': ''}${seconds}`;
}

function displayEndTime(endtime){
    const hms = new Date(endtime);
    endTime.textContent = `${hms.getHours()}:${hms.getMinutes()}`;
}
