var search = {
	imageURL: "",
	imageSizes: [],

	init: () => {
		search.addResultPageEventListeners();
	},

	addResultPageEventListeners: () => {
		let backButton = document.querySelector(".backButtonDiv");
		backButton.addEventListener("click", () => {
			document.querySelector("form[name=formHome] .searchInput").value = document.querySelector("form[name=formResult] .searchInput").value;
			history.back();
		});
	},

	createVideoCard: (photoUrl, title, date, rating, plot) => {
		let template = `<div class="videoCard">
							<div class="photo">`;
		if (photoUrl) {
			template += `<picture>
  						 	<source media="(min-width: 600px)" srcset="${search.imageURL+search.imageSizes[2]+photoUrl}">
  							<source media="(min-width: 350px)" srcset="${search.imageURL+search.imageSizes[3]+photoUrl}">
							<img/>
						</picture>`
		} else {
			template += `<img src="./img/no_image_available.jpg"/>`;
		}
		template += `</div>
					<div class="description">
						<div class="heading">
							<h2 class="title">${title}</h2>
							<p class="date">${date}</p>
							<x-star-rating>`;

		let numOfFullStar = Math.floor(rating / 2);
		let halfStar = rating > 1 ? (rating / 2) - numOfFullStar : 0;
		let numOfEmptyStar = 5 - numOfFullStar;

		for (let x = 1; x <= numOfFullStar; x++) {
			template += "<div class=\"ion-ios-star\"></div>";
		}

		if (halfStar >= 0.5) {
			numOfEmptyStar -= 1;
			template += "<div class=\"ion-ios-star-half\"></div>";
		}

		for (let x = 1; x <= numOfEmptyStar; x++) {
			template += "<div class=\"ion-ios-star-outline\"></div>";
		}

		template += `</x-star-rating>
						</div>
						<div class="body">
							<p class="plot">${plot}</p>
						</div>
					</div>
				</div>`;
		return template;
	},
	
	createPaginationResult: (itemsPerPage, totalItems) => {
		document.querySelector(".pagesResult").innerHTML = `<p>Results 1 - ${itemsPerPage} from a total of ${totalItems} for "Star trek"</p>
				<p>Click on a title to get recommendations</p>`;
	},

	getPosterURLAndImagesSizesInLocalStorage: () => {
		search.imageURL = localStorage.getItem(variables.IMAGE_URL);
		search.imageSizes = localStorage.getItem(variables.IMAGE_SIZES).split(",");
	},

	performSearch: (title) => {
		let url = `${variables.BASE_URL_API}search/${localStorage.getItem(variables.SEARCH_TYPE)}?api_key=${variables.API_KEY}&query=${title}`;

		fetch(url).then((response) => {
			return response.json();
		}).then((data) => {
			console.log(data);

			search.getPosterURLAndImagesSizesInLocalStorage();
			
			document.querySelector(".result .content").innerHTML = "";

			search.createPaginationResult(data["results"].length, data["total_results"]);
			
			data["results"].forEach((item) => {
				document.querySelector(".result .content").innerHTML = document.querySelector(".result .content").innerHTML + search.createVideoCard(item.poster_path, (item.original_name ? item.original_name : item.original_title), item.release_date, item.vote_average, item.overview);
			});
		}).catch((error) => {
			alert(error);
		});
	}

};
search.init();
