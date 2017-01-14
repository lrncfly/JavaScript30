
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullscreen = player.querySelector('[data-size]');

let clicked = false;

function togglePlay(){
	const method = video.paused ? 'play' : 'pause';
	video[method]();
}

function updateButton(){
	const icon = video.paused ? '►' : '❚ ❚';
	toggle.textContent = icon;
}

function updateProgress(){
	const progress = ((video.currentTime / video.duration) * 100) || 0;
	progressBar.style.flexBasis = `${progress}%`;
}

function updateRange(){
	video[this.name] = this.value;
}

function updateSize(){
	player.classList.toggle('fullscreen');
	const full = player.classList.contains("fullscreen") ? '[\u00A0]' : '[\u2921]';
	fullscreen.textContent = full;
}

function seek(e){
	const position = (e.offsetX / progress.offsetWidth) * video.duration;
	video.currentTime = position;
}

function skip(){
	video.currentTime = video.currentTime + parseFloat(this.dataset.skip);
}


video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', updateProgress);

toggle.addEventListener('click', togglePlay);

progress.addEventListener('click', seek);
progress.addEventListener('mousemove', (e) => clicked && seek(e));
progress.addEventListener('mousedown', () => clicked = true);
progress.addEventListener('mouseup', () => clicked = false);

ranges.forEach(range => range.addEventListener('change', updateRange));
skipButtons.forEach(button => button.addEventListener('click', skip));

fullscreen.addEventListener('click', updateSize);

window.onload = updateProgress;