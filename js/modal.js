var modal = {
	init: () => {
		modal.addEventListener();
		modal.getPreferencesFromLocalStorage();
	},

	showModal: (e) => {
		e.preventDefault();
		e.stopPropagation();

		let modal = document.querySelector(".modal");
		modal.classList.remove("modal-off");
		modal.addEventListener("keydown", (e) => {
			if (e.key == "Escape") {
				window.modal.hideModal();
			}
		});
		modal.focus();
		document.querySelector(".overlay").classList.remove("inactive");
		window.modal.getPreferencesFromLocalStorage();
	},

	hideModal: () => {
		document.querySelector(".modal").classList.add("modal-off");
		document.querySelector(".overlay").classList.add("inactive");
	},

	addEventListener: () => {
		document.querySelector("#modalCancelButton").addEventListener("click", (e) => {
			e.preventDefault();
			modal.hideModal();
		});

		document.querySelector(".modal form").addEventListener("submit", (e) => {
			e.preventDefault();
			modal.setPreferencesInLocalStorage();
			modal.hideModal();
		});
	},

	getPreferencesFromLocalStorage: () => {
		let searchType = localStorage.getItem(variables.SEARCH_TYPE);
		if (searchType) {
			document.querySelector(`input[value="${searchType}"]`).checked = true;
		} else {
			modal.setPreferencesInLocalStorage();
		}
	},

	setPreferencesInLocalStorage: () => {
		let searchType = document.querySelector("input:checked");
		if (searchType) {
			localStorage.setItem(variables.SEARCH_TYPE, searchType.value);
		}
	}
}

modal.init();
