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
    animalMovie.displayProducts(res, allItems);
    animalMovie.jumpToList();
  });
};

animalMovie.displayProducts = function (res, allItems) {
  let offset = 0;
  let totalLength = allItems.length;
  let currentItem = 0;

  let result = animalMovie.addTheseNine(
    allItems,
    offset,
    totalLength,
    currentItem
  );

  currentItem = result.newTotalShown;

  //console.log("current item is now " + currentItem);

  if (currentItem < totalLength) {
    $("#loadMore").removeClass("hidden");
  }

  $("#loadMore").on("click", function () {
    offset = offset + 9;
    currentItem = result.newTotalShown;
    //TODO currentItem is always logged as 9 no matter how many clicks
    animalMovie.addTheseNine(allItems, offset, totalLength, currentItem);
    console.log("the current item is now " + currentItem);
  });
};

animalMovie.addTheseNine = function (items, offset, length, totalShownItems) {
  let totalShownItemsNew = totalShownItems;
  console.log("TSIN before loop" + totalShownItemsNew);
  let productHTML = "";

  for (let i = offset; i < offset + 9 && i < length; i++) {
    totalShownItemsNew++;
    productHTML += '<li class="movie">';
    productHTML +=
      '<img src="https://image.tmdb.org/t/p/w500' +
      items[i].poster_path +
      '" />';
    productHTML +=
      "<div class='writeup'><p>item: " +
      totalShownItemsNew +
      "</p><h3>" +
      items[i].title +
      "</h3>";
    productHTML += "<p>" + items[i].overview + "</p></div>";
    productHTML += "</li>";
  }

  $("#container").append(productHTML);

  //console.log("TSIN after loop" + totalShownItemsNew);

  return {
    newTotalShown: totalShownItemsNew,
  };
};

animalMovie.changeBackground = function (animal) {
  const currentAnimal = animal.toLowerCase();
  const currentAnimalUrl = "url('images/" + currentAnimal + ".png')";
  $("body").css("background-image", currentAnimalUrl);
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
