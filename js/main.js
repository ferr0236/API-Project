const movieDataBaseUrl = "https://api.themoviedb.org/3/";
let imageURL = null;
let imageSizes = [];

document.addEventListener("DOMContentLoaded", () => {
	getDataFromLocalStorage();
	addEventListeners();
});

function addEventListeners() {
	let searchButton = document.querySelector(".searchButtonDiv");
	searchButton.addEventListener("click", () => {
		window.alert("aaa");
	});
}

function getDataFromLocalStorage() {
	// check if image secure base url and sizes arrays are saved in local storage, if not call getPosterURLAndSizes()
	
	// if in local storage check if saved over 60 minutes ago, if true call getPosterYRLAndSizes()
	
	// in local storage and < 60 mintueos old,  Load and use from local storage
	getPosterURLAndSizes();
}

function getPosterURLAndSizes() {
	let url = `${movieDataBaseUrl}configuration?api_key=${APIKEY}`;
	
	fetch(url).then( (response) => {
		return response.json();	
	}).then( (data) => {
		console.log(data);
		
		imageURL = data["images"]["secure_base_url"];
		imageSizes = data["images"]["poster_sizes"];
		
		console.log(imageURL);
		console.log(imageSizes);
	}).catch( (error) => {
		console.log(error);
	});
}