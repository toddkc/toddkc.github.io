let color = document.getElementsByTagName('input')[0];
let body = document.getElementsByTagName('body')[0];
let font = document.getElementsByTagName('select')[0];
let paragraph = document.getElementsByTagName('p')[0];
let imageInput = document.getElementsByTagName('select')[1];
let image = document.getElementsByTagName('img')[0];

let savedColor;
let savedFont;
let savedImage;

color.addEventListener('change', changeColor);
font.addEventListener('change', changeFont);
imageInput.addEventListener('change', changeImage);

loadPage();

function loadPage(){
	let storageSupported = true;
	if(storageSupported){
		savedColor = window.localStorage.getItem('color');
		savedFont = window.localStorage.getItem('font');
		savedImage = window.localStorage.getItem('image');
		if(savedColor){
			body.style.backgroundColor = savedColor;
		}
		if(savedFont){
			paragraph.style.fontFamily = savedFont;
		}
		if(savedImage){
			image.setAttribute('src', savedImage);
		}
	}else{
		document.getElementById('storageWarning').style.visibility = 'visible';
	}
}
function changeColor(){
	body.style.backgroundColor = color.value;
	window.localStorage.setItem('color', color.value);
}
function changeFont(){
	paragraph.style.fontFamily = font.value;
	window.localStorage.setItem('font', font.value);
}
function changeImage(){
	image.setAttribute('src', imageInput.value);
	window.localStorage.setItem('image', imageInput.value);
}
