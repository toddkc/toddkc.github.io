//variables
var colors;
var squares;
var pickedColor;
var colorDisplay;
var messageDisplay;
var header;
var resetButton;
var easyButton;
var hardButton;
var numOfSquares=6;

//declare
colors = generateRandomColors(numOfSquares);
squares = document.querySelectorAll(".square");
pickedColor = pickColor();
colorDisplay = document.getElementById("colorDisplay");
messageDisplay = document.getElementById("message");
header = document.querySelector("h1");
resetButton = document.querySelector("#reset");
easyButton = document.querySelector("#easyBtn");
hardButton = document.querySelector("#hardBtn");

//setup
//add click event to reset button
resetButton.addEventListener("click", reset);
//add click event to easy/hard buttons
easyButton.addEventListener("click", function () {
numOfSquares = 3;
messageDisplay.textContent = " ";
easyButton.classList.add("selected");
hardButton.classList.remove("selected");
colors = generateRandomColors(numOfSquares);
pickedColor = pickColor();
colorDisplay.textContent = pickedColor;
for (var i = 0; i < squares.length; i++) {
		if(colors[i]){
				squares[i].style.backgroundColor = colors[i];
		}else{
				squares[i].style.display = "none";
		}
}
});
hardButton.addEventListener("click", function () {
numOfSquares = 6;
messageDisplay.textContent = " ";
easyButton.classList.remove("selected");
hardButton.classList.add("selected");
colors = generateRandomColors(numOfSquares);
pickedColor = pickColor();
colorDisplay.textContent = pickedColor;
for (var i = 0; i < squares.length; i++) {
		squares[i].style.backgroundColor = colors[i];
		squares[i].style.display = "block";
}
});
//set header text to picked color
colorDisplay.textContent=pickedColor;
//loop through each swatch, set color, add click event
for(var i=0; i<squares.length;i++)
{
squares[i].style.backgroundColor = colors[i];
squares[i].addEventListener("click", clickCheck);
}


//reset page
function reset()
{
colors = generateRandomColors(numOfSquares);
pickedColor = pickColor();
colorDisplay.textContent = pickedColor;
header.style.backgroundColor = "steelblue";
resetButton.textContent = "New Colors?";
messageDisplay.textContent = " ";
for(var i=0; i<squares.length;i++)
{
		squares[i].style.backgroundColor = colors[i];
}
}

//check clicked color
function clickCheck()
{
var clickedColor= this.style.backgroundColor;
if (clickedColor === pickedColor) {
		messageDisplay.textContent = "Correct!";
		header.style.backgroundColor = clickedColor;
		resetButton.textContent = "Play Again?";
		for(var i=0; i < colors.length; i++)
		{
				squares[i].style.backgroundColor = clickedColor;
		}
} else
		{
		this.style.backgroundColor = "#232323";
		messageDisplay.textContent = "Try Again";
}
}

//pick random color
function pickColor()
{
var random = Math.floor(Math.random()*colors.length);
return colors[random];
}

//generate random colors for swatches
function generateRandomColors(num)
{
var arr = [];
for (var i = 0; i < num; i++)
{
		arr.push(randomColor());
}
return arr;
}

//generate random rgb color
function randomColor()
{
var r = Math.floor(Math.random() * 256);
var g = Math.floor(Math.random() * 256);
var b = Math.floor(Math.random() * 256);
return "rgb(" + r + ", " + g + ", " + b + ")";
}
