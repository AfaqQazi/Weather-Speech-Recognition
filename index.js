// cache
const getDate = document.querySelector('.date');
const getTime = document.querySelector('.time');
const getHumidity = document.querySelector('.humidity');
const getPressure = document.querySelector('.pressure');
const getWind = document.querySelector('.wind');
const getWeatherIcon = document.querySelector('.weather-box-icon');
const getTemperature = document.querySelector('.temperature');
const getGreeting = document.querySelector('.greeting');
const getWeatherType = document.querySelector('.weather-type');

let temperature,
weatherType,
humidity,
pressure,
wind;

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

let p = document.createElement('p');
let words = document.querySelector('.words');
words.appendChild(p);

recognition.addEventListener('result' , e => {
	let transcript = e.results[0][0].transcript;
	p.textContent = transcript;
	if (e.results[0].isFinal) {
	  p = document.createElement('p');
	  words.appendChild(p);
	}

	const keySentence = 'how is the weather in';
	if (transcript.includes(keySentence)) {
	   let location = transcript.split(" ").splice(-1).join("");
	   pullRequest(location);
	} 
})

function pullRequest(location) {
	let request = new XMLHttpRequest();
	const proxyUrl = "https://cors-anywhere.herokuapp.com/";
	const url = `https://api.weatherbit.io/v2.0/current?city=${location}&key=5e0b777c1872461ba49e8a16eaae652c`;
	request.open('GET' , url);
	request.onload = function() {
		let data = JSON.parse(request.responseText);
		pullData(data);
	}
	request.send();
}

function pullData(data) {
	temperature = data.data[0].temp;
	weatherType = data.data[0].weather.description;
	humidity = '67%'; // not given so harcoded
	pressure = data.data[0].pres;
	wind = data.data[0].wind_spd;

	// convert temp fahrenheit to celcius
	// temperature = Math.floor((temperature - 32) * .5556);

	// populate
	getHumidity.innerHTML = `Humidity : ${humidity}`;
	getPressure.innerHTML = `Pressure : ${pressure}`;
	getWind.innerHTML = `Wind : ${wind}km/h`;
	getTemperature.innerHTML = temperature;
	getWeatherType.innerHTML = weatherType;

	// date
	let newDate = new Date();
	let days = ['Sunday' , 'Monday' , 'Tuesday' , 'Wednesday' , 'Thursday' , 'Friday' , 'Saturday'];
	let months = ['January' , 'Feburary' , 'March' , 'April' , 'May' , 'June' , 'july' , 'Auguest' , 'September' , 'October' , 'November' , 'December'];
	getDate.innerHTML = `${days[newDate.getDay()]}, ${months[newDate.getMonth()]} ${newDate.getFullYear()}`;

	// time
	setInterval(() => {
		let newDate = new Date();
		let hours = newDate.getHours();
		let minutes = newDate.getMinutes();
		let seconds = newDate.getSeconds();

		hours = hours % 12 || 12;

		if (hours < 10) hours = `0${hours}`;
		if (minutes < 10) minutes = `0${minutes}`;
		if (seconds < 10) seconds = `0${seconds}`;
		const amPm = hours >= 12 ? 'PM' : 'AM';
		getTime.innerHTML = `${hours}:${minutes}:${seconds} ${amPm}`

		// greetings 
		if (hours < 12)  {
			getGreeting.innerHTML = 'Morning time';	 
			weatherBox.style.backgroundImage = "url(images/morning.jpg)";
			weatherBox.style.color = 'whitesmoke';
			weatherBox.style.textShadow = '0px 0px 5px black';
		} else if (hours > 18) {
			getGreeting.innerHTML = 'Afternoon time';
			weatherBox.style.backgroundImage = "url(images/afternoon.jpg)";
			weatherBox.style.color = 'whitesmoke';
			weatherBox.style.textShadow = '0px 0px 5px black';
		} else {
			getGreeting.innerHTML = 'Evening time';
			weatherBox.style.backgroundImage = "url(images/night.jpg)";
			weatherBox.style.color = 'whitesmoke';
		}
	} , 1000)

	// Animation
	slideIn();
}

function slideIn() {
	const weatherBox = document.getElementById('weatherBox');
	weatherBox.classList.add('slidein')
}

recognition.addEventListener('end' , recognition.start);
recognition.start();


