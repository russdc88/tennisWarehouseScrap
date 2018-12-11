function getRacketinfo(data) {
	$(".tennisList").empty()
	for (var i = 0; i < data.length; i++) {
		var image = '<img class="tennisPic " src=' + data[i].image + 'alt="">'

		var title = '<h5>' + data[i].title + '</h5>'

		var headSize = '<p><strong> Headsize</strong>: ' + data[i].headSize + ' in sq.</p>'

		var racLength = '<p><strong> Racquet Length</strong>: ' + data[i].racLength + ' inches</p>'

		var racBalance = '<p><strong> Racquet Balance</strong>: ' + data[i].racBalance + '</p>'

		var swingWeight = '<p><strong> Swing Weight </strong>: ' + data[i].swingWeight + '</p>'

		var tennisLink = '<a href=' + data[i].link + ' target=_blank >See More Info on Tennis Warehouse</a>'

		var column1 = '<div class = "col-md-2"> ' + image + '</div>'

		var column2 = '<div class = "col-md-10 content"> ' +
			title +
			headSize +
			racLength +
			racBalance +
			swingWeight +
			tennisLink +
			'</div>'

		var row = '<div class = "row pb-4" >' +
			column1 +
			column2 +
			'</div>'

		$(".tennisList").append(row + '<hr>')

	}
}

$.getJSON("/racquets", function (data) {

	getRacketinfo(data)

})

$(document).on("click", ".searchButton", function (event) {
	event.preventDefault()

	var searchRacquet = $(".searchInput").val()

	$.ajax({
		method: "GET",
		url: "/racquets/" + searchRacquet
	})
		.then(function (data) {
			$(".searchInput").val("")
			getRacketinfo(data)
			console.log(data)

		})
})

$(document).on("click", ".descending", function (event) {
	event.preventDefault()

	var racCategory = $(this).attr("id")


	$.ajax({
		method: "GET",
		url: "/sortracquets/" + racCategory
	})
		.then(function (data) {
			console.log(data)
			getRacketinfo(data)

		})
})



