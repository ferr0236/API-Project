var search = {
	imageURL: "",
	imageSizes: [],
	currentPage: 1,

	init: () => {
		search.addResultPageEventListeners();
	},

	addResultPageEventListeners: () => {
		let backButton = document.querySelector(".backButtonDiv");
		backButton.addEventListener("click", () => {
			document.querySelector("form[name=formHome] .searchInput").value = document.querySelector("form[name=formResult] .searchInput").value;
			location.href = location.href.substr(0,location.href.indexOf("#"));
			app.init();
			
		});

		document.querySelector(".priorPageButtonDiv").addEventListener("click", (e) => {
			history.back();
		});

		document.querySelector(".nextPageButtonDiv").addEventListener("click", (e) => {
			search.performSearch(document.querySelector(".result .searchInput").value, currentPage + 1, true);
		});
	},

	createVideoCard: (photoUrl, title, date, rating, plot) => {
		let template = `<div class="videoCard" onclick="search.performSearch('${title}',1,true)">
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

	createPaginationResult: (itemsPerPage, currentPage, totalItems, totalPages, title) => {
		document.querySelector(".pagesResult").innerHTML = `<p>Results ${currentPage == totalPages ? totalItems - itemsPerPage : itemsPerPage * (currentPage -1) + 1} - ${currentPage == totalPages ? totalItems : itemsPerPage * currentPage} from a total of ${totalItems} for ${title}</p>
				<p>Click on a title to get recommendations</p>`;

		window.currentPage = currentPage;
		let priorPageButton = document.querySelector(".priorPageButtonDiv");
		if (currentPage > 1) {
			priorPageButton.classList.remove("inactive");
		} else {
			priorPageButton.classList.add("inactive");
		}

		if (totalPages > 1 && currentPage < totalPages) {
			document.querySelector(".nextPageButtonDiv").classList.remove("inactive");
		} else {
			document.querySelector(".nextPageButtonDiv").classList.add("inactive");
		}
	},

	getPosterURLAndImagesSizesInLocalStorage: () => {
		search.imageURL = localStorage.getItem(variables.IMAGE_URL);
		search.imageSizes = localStorage.getItem(variables.IMAGE_SIZES).split(",");
	},

	performSearch: (title, page, createHistory) => {
		let searchType = localStorage.getItem(variables.SEARCH_TYPE);
		let url = `${variables.BASE_URL_API}search/${searchType}?api_key=${variables.API_KEY}&query=${title}&page=${page}`;

		fetch(url).then((response) => {
			return response.json();
		}).then((data) => {
			console.log(data);
			document.querySelector(".result .searchInput").value = title;

			search.getPosterURLAndImagesSizesInLocalStorage();

			document.querySelector(".result .content").innerHTML = "";

			search.createPaginationResult(data["results"].length, data["page"], data["total_results"], data["total_pages"], title);

			if (createHistory) {
				history.pushState({"search":title}, title, "#result?title="+title+"?page="+page);
			}
			
			data["results"].forEach((item) => {
				let photo = "";
				let title = "";
				let date = "";
				let rating = "";
				let overview = "";
				switch (searchType) {
					case "movie":
						photo = item.poster_path;
						title = item.original_title;
						date = item.release_date;
						rating = item.vote_average;
						overview = item.overview;
						break;
					case "person":
						photo = item.profile_path;
						title = item.name;
						date = "";
						rating = item.popularity;
						overview = "<h2 class=\"title\">Known for</h2><div>";
						item.known_for.forEach((item) => {
							overview += `<p>${item.original_title ? item.original_title : item.original_name}</p>`;
						});
						overview += "</div>"
						break;
					case "tv":
						photo = item.profile_path;
						title = item.original_name;
						date = item.first_air_date;
						rating = item.vote_average;
						overview = item.overview;
						break;
				}
				document.querySelector(".result .content").innerHTML = document.querySelector(".result .content").innerHTML + search.createVideoCard(photo, title, date, rating, overview);
			});
		}).catch((error) => {
			alert(error);
		});
	}

};
search.init();
