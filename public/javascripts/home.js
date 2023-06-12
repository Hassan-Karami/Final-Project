$(document).ready(function () {
  var articlesContainer = $("#articles-container");
  const paginationUl = $("#paginationUl");

  // this.handlePaginationButton = (element) => {
  //    const active = $(".active");
  //    active[0].classList.remove("active");
  //    element.classList.add("active");  
  // };

 

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  //get pagenumber form query string
  let page = urlParams.get("page");
  if (!page) page = 1;

  //get limit number from query string
  let limit = urlParams.get("limit");
  if (!limit) limit = 3;

  // Fetch articles from the server
  fetch(`http://localhost:9000/api/articles?page=${page}`) // Replace with your API endpoint
    .then((response) => response.json())
    .then((data) => {
      const total = data.total;
      const pages = data.pages;
      console.log("total articles: " + total);
      console.log("total pages: " + pages);
      var articles = data.data;

      for (let i = 0; i < pages; i++) {
        if(i+1 == page){
            paginationUl.append(
              `<li  class="page-item"><a class="page-link active" href="http://localhost:9000?page=${
                i + 1
              }">${i + 1}</a></li>`
            );
        }
        else{
           paginationUl.append(
             `<li  class="page-item"><a class="page-link" href="http://localhost:9000?page=${
               i + 1
             }">${i + 1}</a></li>`
           );

        }
        
      }

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
          "By " + article.author.firstName + " " + article.author.lastName
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

