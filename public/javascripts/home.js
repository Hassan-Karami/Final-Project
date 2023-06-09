$(document).ready(async function () {
  var articlesContainer = $("#articles-container");
  const paginationUl = $("#paginationUl");

  let userRole = "unknown";

  const navBar_container = $("#navBar-container");
  const navBarComponent= await navBarGenerator();
  console.log(navBarComponent);
  navBar_container.append(navBarComponent);

  //check session
  const chechSession = await checkSession();
  console.log(chechSession);
  if (chechSession !== false && chechSession.role === "admin") {
    userRole = "admin";
  }

  //logout button handling
  const logoutButton = $("#logout-anchor");
  logoutButton.on("click", async (event) => {
    try {
      event.preventDefault();
      const logoutResponseObject = await fetch(
        "http://localhost:9000/api/auth/logout"
      );
      const logoutResponse = await logoutResponseObject.json();
      if (
        logoutResponseObject.status >= 400 &&
        logoutResponseObject.status < 600
      ) {
        showMessage(logoutResponse.message,"error");
      }
      else{
           showMessage("successfull logout", "success");
           setTimeout(() => {
             window.location.href = "http://localhost:9000/login";
           }, 1500);

      }
   
    } catch (error) {
      console.log(error);
    }
  });

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  
  //get pagenumber form query string
  let page = urlParams.get("page");
  if (!page) page = 1;

  //get limit number from query string
  let limit = urlParams.get("limit");
  if (!limit) limit = 3;

  //get searcht text
  let searchText = urlParams.get("search");
  
  //URL 
  let UrlOfGettingArticles;

  if(!!searchText) UrlOfGettingArticles= `http://localhost:9000/api/articles?page=${page}&search=${searchText}`;
  else{
    UrlOfGettingArticles= `http://localhost:9000/api/articles?page=${page}`;
  }

  //search button handling
  const search_input = $("#search_input");

  const search_btn = $("#search_btn");

  search_btn.on("click", async (e) => {
    e.preventDefault();
    const searchInputText = search_input.val().trim();
    window.location.href = `http://localhost:9000?search=${searchInputText}`;
    
  });

  

  // Fetch articles from the server
  fetch(UrlOfGettingArticles) // Replace with your API endpoint
    .then((response) => response.json())
    .then((data) => {
      const total = data.total;
      const pages = data.pages;
      console.log("total articles: " + total);
      console.log("total pages: " + pages);
      var articles = data.data;
      if(articles.length<1){
        return 
      }
      //generate pagination cells
      for (let i = 0; i < pages; i++) {
        if (i + 1 == page) {
          paginationUl.append(
            `<li  class="page-item"><a class="page-link active" href="http://localhost:9000?page=${
              i + 1
            }">${i + 1}</a></li>`
          );
        } else {
          paginationUl.append(
            `<li  class="page-item"><a class="page-link" href="http://localhost:9000?page=${
              i + 1
            }">${i + 1}</a></li>`
          );
        }
      }

      // iterate through each article and create a card for it
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

        //ADMIN delete button adding
        if (userRole === "admin") {
          const editButton = $('<a class="btn btn-danger">').text(
            "Delete Article"
          );
     
          editButton.on("click",async(e)=>{
            e.preventDefault();
              const responseObject = await fetch(
                `http://localhost:9000/api/articles/${articleId}`,
                {
                  method: "DELETE",
                }
              );
              console.log(responseObject);
              const response = await responseObject.json();
              console.log(response);

              if (responseObject.status >= 400 && responseObject.status < 600) {
                showMessage(response.message, "error");
              }
              if (responseObject.status === 200) {
                showMessage(response.message, "success");
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              }

          
          })
          
          
          cardBody.append(editButton);
        }

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
