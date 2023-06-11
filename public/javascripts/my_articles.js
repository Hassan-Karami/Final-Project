$(document).ready(async function () {
 try {
   const articlesContainer = $("#articles-container");
   const responseObject = await fetch(`http://localhost:9000/api/articles/me`);
   const articles = await responseObject.json();
   if(responseObject.status === 401) {
    showMessage("you are not logged in. login first...","error");
    setTimeout(() => {
      window.location.href = "http://localhost:9000/login";
    }, 1000);
   }
   console.log(articles);
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
  
 } catch (error) {
  console.log(error?.message);
 }
});
