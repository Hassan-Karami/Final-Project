$(document).ready(function () {
  var articlesContainer = $("#articles-container");

  // Fetch articles from the server
    fetch(`http://localhost:9000/api/articles`) // Replace with your API endpoint
    .then((response) => response.json())
    .then((data) => {
      var articles = data;
      
      // Loop through each article and create a card for it
      articles.forEach(function (article) {
        console.log(article);
        var card = $('<div class="card mb-3">');
        var cardBody = $('<div class="card-body">');
        var cardImg = $(
          '<img class="float-right ml-3" style="max-width: 200px;">'
        ).attr("src", `/images/articles/thumbnails/${article.thumbnail}`);
        var cardTitle = $('<h5 class="card-title">').text(article.title);
        var cardAuthor = $('<p class="card-text">').text(
          "By " + article.author.firstName+ " " + article.author.lastName
        );
        var cardDesc = $('<p class="card-text">').text(
          article.description + "..."
        );

        var cardButton = $('<a class="btn btn-primary">').text("More Info");

        const articleId = article._id;

        cardButton.attr(
          "href",
          `http://localhost:9000/article_details/${articleId}`
        );

        // Append elements to the card body
        cardBody.append(cardImg);
        cardBody.append(cardTitle);
        cardBody.append(cardAuthor);
        cardBody.append(cardDesc);
        cardBody.append(cardButton);

        // Append card body to the card
        card.append(cardBody);

        // Append the card to the articles container
        articlesContainer.append(card);
      });
    })
    .catch((error) => {
      console.log("Error retrieving articles:", error);
    });
});
