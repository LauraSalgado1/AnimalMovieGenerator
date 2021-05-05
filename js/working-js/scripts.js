var animalMovie = {};

animalMovie.key = "19c1732f3fd1fbaa0320b2839709698a";

animalMovie.init = function () {
  $("#animal").on("change", function () {
    let animal = $(this).find(":selected").text();
    animalMovie.getKeywordId(animal);
    animalMovie.listTitle(animal);
    animalMovie.changeBackground(animal);
  });
};

animalMovie.getKeywordId = function (animalQuery) {
  //get the id of the keyword submitted from the select change
  $.ajax({
    url:
      "http://api.themoviedb.org/3/search/keyword?api_key=19c1732f3fd1fbaa0320b2839709698a&query=" +
      animalQuery,
    method: "GET",
    dataType: "json",
  }).then(function (res) {
    const keywordId = res.results[0].id;
    animalMovie.getMovieFromId(keywordId);
  });
};

animalMovie.getMovieFromId = function (keywordId) {
  //use the id retrieved from the first ajax call to make another ajax call using that id
  $.ajax({
    url:
      "http://api.themoviedb.org/3/keyword/" +
      keywordId +
      "/movies?api_key=19c1732f3fd1fbaa0320b2839709698a&query=",
    method: "GET",
    dataType: "json",
  }).then(function (res) {
    $("#container").empty();
    var allItems = res.results;
    animalMovie.displayItems(allItems);
    animalMovie.jumpToList();
  });
};

animalMovie.displayItems = function (allItems) {
  let itemHTML = "";
  for (let i = 0; i < allItems.length; i++) {
    if (allItems[i].poster_path != null) {
      itemHTML += '<li class="movie">';
      itemHTML +=
        '<img src="https://image.tmdb.org/t/p/w500' +
        allItems[i].poster_path +
        '" width="500" height="750" loading="lazy"/>';
      itemHTML += "<div class='writeup'><h3>" + allItems[i].title + "</h3>";
      itemHTML += "<p>" + allItems[i].overview + "</p></div>";
      itemHTML += "</li>";
    }
  }
  $("#container").append(itemHTML);
};

animalMovie.changeBackground = function (animal) {
  const currentAnimal = animal.toLowerCase();
  const currentAnimalUrl =
    "url('images/" +
    currentAnimal +
    ".svg'), url('images/" +
    currentAnimal +
    ".svg')";
  $(".content-area").css("background-image", currentAnimalUrl);
};

animalMovie.jumpToList = function () {
  const getElemDistance = function (elem) {
    let location = 0;
    if (elem.offsetParent) {
      do {
        location += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }
    return location >= 0 ? location : 0;
  };
  const elem = document.querySelector("#contentArea");
  const location = getElemDistance(elem);
  window.scroll({
    top: location - 50,
    left: 100,
  });
};

animalMovie.listTitle = function (selection) {
  $("#listTitleBar").empty();
  const listTitle = $("<h2>").text("Movies Starring The " + selection);
  const titleContainer = $("#listTitleBar");
  titleContainer.append(listTitle);
};

$(function () {
  animalMovie.init();
});
