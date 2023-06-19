$(document).ready(async function () {
  try {
    const paginationUl = $("#paginationUl");
    const articlesContainer = $("#articles-container");
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    //get pagenumber form query string
    let page = urlParams.get("page");
    if (!page) page = 1;

    //get limit number from query string
    let limit = urlParams.get("limit");
    if (!limit) limit = 3;
    //fetch data
    const responseObject = await fetch(
      `http://localhost:9000/api/articles/me?page=${page}`
    );
    const data = await responseObject.json();
    console.log(responseObject);
    if (responseObject.status === 401) {
      showMessage("you are not logged in. login first...", "error");
      setTimeout(() => {
        window.location.href = "http://localhost:9000/login";
      }, 1000);
    }

    const total = data.total;
    const pages = data.pages;
    console.log("total articles: " + total);
    console.log("total pages: " + pages);
    const articles = data.data;
    if (articles.length < 1) {
      return showMessage("no article registered for this user", "error");
    }
    console.log(articles);

    //generate pagination
    for (let i = 0; i < pages; i++) {
      if (i + 1 == page) {
        paginationUl.append(
          `<li  class="page-item"><a class="page-link active" href="http://localhost:9000/my_articles?page=${
            i + 1
          }">${i + 1}</a></li>`
        );
      } else {
        paginationUl.append(
          `<li  class="page-item"><a class="page-link" href="http://localhost:9000/my_articles?page=${
            i + 1
          }">${i + 1}</a></li>`
        );
      }
    }
    //generate article cards
    articles.forEach(function (article) {
      const card = $('<div class="card mb-3">');
      const cardBody = $('<div class="card-body">');
      const cardImg = $(
        '<img class="float-right ml-3" style="max-width: 200px;">'
      ).attr("src", `/images/articles/thumbnails/${article.thumbnail}`);
      const cardTitle = $('<h5 class="card-title">').text(article.title);
      const cardAuthor = $('<p class="card-text">').text(
        "By " + article.author.firstName + " " + article.author.lastName
      );
      const cardDesc = $('<p class="card-text">').text(
        article.description + "..."
      );

      const cardButton = $('<a class="btn btn-primary">').text("More Info");

      const articleId = article._id;

      cardButton.attr(
        "href",
        `http://localhost:9000/update_article/${articleId}`
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

    //logout button handling
    const logoutButton = $("#logout-anchor");
    logoutButton.on("click", async (event) => {
      try {
        event.preventDefault();
        const logoutResponseObject = await fetch(
          "http://localhost:9000/api/auth/logout"
        );
        showMessage("successfull logout", "success");
        setTimeout(() => {
          window.location.href = "http://localhost:9000/login";
        }, 1500);
      } catch (error) {
        console.log(error);
      }
    });
  } catch (error) {
    console.log(error?.message);
  }
});
