var app = {
	init: () => {
		history.replaceState({}, "Home", "#home");
		app.addDefaultEventListener();
		app.showPage(".home");
		app.setPosterURLAndImagesSizesInLocalStorage();
		setInterval(() => {
			app.setPosterURLAndImagesSizesInLocalStorage();
		}, 3600000);
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
			let page = location.hash;
			if (page != "") {
				app.showPage(`.${page.substr(1)}`);
			}
		});

		document.querySelectorAll(".searchInput").forEach((input) => {
			input.addEventListener("keydown", (e) => {
				if (e.key == "Enter") {
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
					history.pushState({}, "Result Page", "#result");
					app.showPage(".result");
					document.querySelector("form[name=formResult] .searchInput").value = document.querySelector("form[name=formHome] .searchInput").value;
				}
				search.performSearch(e.target.querySelector(".searchInput").value);
			});
		});
	},

	submitForm: (form) => {
		if (!form.checkValidity()) {
			form.reportValidity();
		} else {
			form.dispatchEvent(new Event("submit"));
		}
	},

	setPosterURLAndImagesSizesInLocalStorage: () => {
		let url = `${variables.BASE_URL_API}configuration?api_key=${variables.API_KEY}`;

		fetch(url).then((response) => {
			return response.json();
		}).then((data) => {
			localStorage.setItem(variables.IMAGE_URL, data["images"]["secure_base_url"]);
			localStorage.setItem(variables.IMAGE_SIZES, data["images"]["poster_sizes"]);
		}).catch((error) => {
			console.log(error);
		});
	}
};

document.addEventListener("DOMContentLoaded", app.init);
