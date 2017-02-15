const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
let filterEnabled = false;
function getVideo(){
	navigator.mediaDevices.getUserMedia({ video: true, audio: false })
		.then(localMediaStream => {
			console.log(localMediaStream);
			video.src = window.URL.createObjectURL(localMediaStream);
			video.play();
		})
		.catch(err => {
			console.log('some error: ', err);
		});
}
function paintToCanvas() {
	const width = video.videoWidth;
	const height = video.videoHeight;

	canvas.width = width;
	canvas.height = height;

	return setInterval(()=>{
		ctx.drawImage(video, 0,0, width,height);
		let imageData = ctx.getImageData(0,0,width,height);
		if (effects.filter){
			imageData = filterEffect(imageData);
			ctx.putImageData(imageData, 0, 0);
		}
		if (effects.split){
			imageData = splitEffect(imageData);
			ctx.putImageData(imageData, 0, 0);
		}
		if (effects.greenScreen){
			imageData = greenScreen(imageData);
			ctx.putImageData(imageData, 0, 0);
		}
	}, 10);
}

function filterEffect(pixels){
	for (var i = 0; i < pixels.data.length; i+=4) {
		pixels.data[i] = pixels.data[i] + levels.rfil;
		pixels.data[i+1] = pixels.data[i+1] + levels.gfil;
		pixels.data[i+2] = pixels.data[i+2] + levels.bfil;
	}
	return pixels;
}

function splitEffect(pixels){
	for(let i = 0; i < pixels.data.length; i+=4) {
	  pixels.data[i + levels.rfil] = pixels.data[i + 0]; // RED
	  pixels.data[i - levels.gfil] = pixels.data[i + 1]; // GREEN
	  pixels.data[i + levels.bfil] = pixels.data[i + 2]; // Blue
	}
	return pixels;
}

function greenScreen(pixels){
	for (i = 0; i < pixels.data.length; i = i + 4) {
	  red = pixels.data[i + 0];
	  green = pixels.data[i + 1];
	  blue = pixels.data[i + 2];
	  alpha = pixels.data[i + 3];

	  if (red >= minmaxlevels.rmin &&
	      green >= minmaxlevels.gmin &&
	      blue >= minmaxlevels.bmin &&
	      red <= minmaxlevels.rmax &&
	      green <= minmaxlevels.gmax &&
	      blue <= minmaxlevels.bmax) {
	    // take it out!
	    pixels.data[i + 3] = 0;
	  }
	}

	return pixels;
}

function takePhoto() {
  // played the sound
  snap.currentTime = 0;
  snap.play();
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'myimage');
  link.innerHTML = `<img src="${data}" alt="Image from webcam" />`;
  strip.insertBefore(link, strip.firsChild);
}

const levels = {};
const minmaxlevels = {};
const effects = {};
function handleFilter(evt){
	effects[evt.target.name] = evt.target.checked;
}
getVideo();

function handleUpdateLevel(){
	levels[this.name] = this.value;
}
 function handleUpdateMinMaxLevel(){
 	minmaxlevels[this.name] = this.value;
 }

const filterLevels = document.querySelectorAll('.filters input');
filterLevels.forEach(input => input.addEventListener("change", handleUpdateLevel));

const filterboxes = document.querySelectorAll('.controls input[type="checkbox"]');
filterboxes.forEach(checkbox => checkbox.addEventListener('click', handleFilter));

const minmaxLevels = document.querySelectorAll('.rgb input');
minmaxLevels.forEach(input => input.addEventListener("change", handleUpdateMinMaxLevel));

video.addEventListener('canplay', paintToCanvas);
