$(document).ready(function() {
const url = window.location.pathname;
const articleId = url.substring(url.lastIndexOf('/') + 1);
fetch(`http://localhost:9000/api/articles/${articleId}`).then((data)=>{
    if(data.status !== 200){
        showMessage("an error eccured","error")
    } ;
    return data.json()
}).then((article)=>{
    console.log(article);
    const thumbnail = $("#thumbnail");
    const imagesContainer = $("#image-container");
    const content = $("#content");
    const title = $("#title");
    const author = $("#author");
    const createdAt = $("#createdAt");
    

    thumbnail.attr("src", `/images/articles/thumbnails/${article.thumbnail}`)
    content.html(article.content);
    title.html(article.title);
    author.html(article.author.firstName + " " + article.author.lastName);
    createdAt.html(article.registration_date.split("T")[0]);


    if(article.images && article.images.length>0){
        for (let i = 0; i < article.images.length; i++) {
          imagesContainer.append(
            `<div style=" display: inline-block; margin: 0 auto; width: 18%; height: 100%;"><img  style="width:100%; height:100%" src="/images/articles/images/${article.images[i]}" alt=""></div>`
          );
        }
    }



    
}).catch((error)=>{console.log(error);});
});




