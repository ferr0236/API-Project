var app = {
	init: () => {
		if (location.hash) {
			history.replaceState({}, location.hash.substr(1), location.hash);
		} else {
			history.replaceState({}, "Home", "#home");
		}
		app.addDefaultEventListener();
		app.showPage(`.${location.hash.substr(1)}`);
		app.setPosterURLAndImagesSizesInLocalStorage();
	},

	showPage: (pageClass) => {
		let currentActivePage = document.querySelector(".active");
		if (currentActivePage) {
			currentActivePage.classList.remove("active");
			currentActivePage.classList.add("inactive");
		}

		let pageToBeActived = document.querySelector(pageClass);
		pageToBeActived.classList.remove("inactive");
		pageToBeActived.classList.add("active");
	},

	addDefaultEventListener: () => {
		let settingsButton = document.querySelectorAll(".settingsButtonDiv");
		settingsButton.forEach((item) => {
			item.addEventListener("click", (e) => {
				modal.showModal(e);
			});
		});

		window.addEventListener("hashchange", () => {
			let queryString = app.getQueryString();
			if (queryString) {
				app.showPage(queryString.page);
				if (queryString.recommendation) {
					search.performSearch(queryString.searchParam, queryString.numPage, false, queryString.recommendation);
				} else {
					search.performSearch(queryString.searchParam, queryString.numPage, false, null);
				}
			}
		});

		document.querySelectorAll(".searchInput").forEach((input) => {
			input.addEventListener("keydown", (e) => {
				if (e.key == "Enter") {
					e.preventDefault();
					app.submitForm(input.parentNode);
				}
			});
		});

		document.querySelectorAll(".searchButtonDiv").forEach((item) => {
			item.addEventListener("click", () => {
				app.submitForm(item.parentNode);
			});
		});

		document.querySelectorAll(".home form, .result form").forEach((form) => {
			form.addEventListener("submit", (e) => {
				e.preventDefault();
				if (e.target.name == "formHome") {
					app.showPage(".result");
					document.querySelector("form[name=formResult] .searchInput").value = document.querySelector("form[name=formHome] .searchInput").value;
				}
				search.performSearch(e.target.querySelector(".searchInput").value, 1, true, null);
			});
		});
	},

	getQueryString: () => {
		let page = location.hash;
		if (page != "")  {
			let queryString = {
				page: "",
				searchParam: "",
				numPage: "",
				recommendation: ""
			};
			if (page.indexOf("?") != -1) {
				queryString.page = `.${page.substr(1,page.indexOf("?")-1)}`;

				let params = page.substr(page.indexOf("?") + 1).split("?");
				queryString.searchParam = params[0].split("=")[1];
				queryString.numPage = params[1].split("=")[1];
				if (params.length > 2) {
					queryString.recommendation = params[2].split("=")[1].replace(/%20/g, " ");
				}
			} else {
				queryString.page = `.${page.substr(1)}`;
			}
			return queryString;
		}
		return null;
	},
	
	submitForm: (form) => {
		if (!form.checkValidity()) {
			form.reportValidity();
		} else {
			form.dispatchEvent(new Event("submit"));
		}
	},

	isLastUpdateLocalStorageExpired: () => {
		let lastUpdateLocalStorage = localStorage.getItem(variables.LAST_UPDATE_LOCALSTORAGE);
		if (lastUpdateLocalStorage) {
			let lastUpdate = new Date(lastUpdateLocalStorage);
			return ((lastUpdate.getTime() + 3600000) < new Date().getTime());
		} else {
			return true;
		}
		
	},
	
	setPosterURLAndImagesSizesInLocalStorage: () => {
		if (app.isLastUpdateLocalStorageExpired()) {
			let url = `${variables.BASE_URL_API}configuration?api_key=${variables.API_KEY}`;
			fetch(url).then((response) => {
				return response.json();
			}).then((data) => {
				localStorage.setItem(variables.IMAGE_URL, data["images"]["secure_base_url"]);
				localStorage.setItem(variables.IMAGE_SIZES, data["images"]["poster_sizes"]);
				localStorage.setItem(variables.LAST_UPDATE_LOCALSTORAGE, new Date().getTime());
			}).catch((error) => {
				console.log(error);
			});
		}
	}
};

document.addEventListener("DOMContentLoaded", app.init);
