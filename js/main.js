const movieDataBaseUrl = "https://api.themoviedb.org/3/";
let imageURL = null;
let imageSizes = [];

document.addEventListener("DOMContentLoaded", () => {
	getDataFromLocalStorage();
	addEventListeners();
	showPage(".home");
});

function addEventListeners() {
	let searchButton = document.querySelector(".home .searchButtonDiv");
	searchButton.addEventListener("click", () => {
		showPage(".result");
	});
	
	let backButton = document.querySelector(".backButtonDiv");
	backButton.addEventListener("click", () => {
		showPage(".home");
	});
	
	let settingsButton = document.querySelectorAll(".settingsButtonDiv");
	settingsButton.forEach( (item) => { 
		item.addEventListener("click", (e) => {
			showSettingsModal(e);
		});
	});
	
	let modalCancelButton = document.querySelector("#modalCancelButton");
	modalCancelButton.addEventListener("click", () => {
		hideSettingsModal();
	});
}

function showPage(pageClass) {
	let currentActivePage = document.querySelector(".active");
	if (currentActivePage) {
		currentActivePage.classList.remove("active");
		currentActivePage.classList.add("inactive");
	}
	
	let pageToBeActived = document.querySelector(pageClass);
	pageToBeActived.classList.remove("inactive");
	pageToBeActived.classList.add("active");
}

function showSettingsModal(e) {
	e.preventDefault();
	e.stopPropagation();
	
	let modal = document.querySelector(".modal");
	modal.classList.remove("modal-off");
	modal.addEventListener("keydown", (e) => {
		if (e.key == "Escape") {
			hideSettingsModal();
		}
	});
	modal.focus();
	document.querySelector(".overlay").classList.remove("inactive");
}

function hideSettingsModal() {
	document.querySelector(".modal").classList.add("modal-off");
		document.querySelector(".overlay").classList.add("inactive");
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