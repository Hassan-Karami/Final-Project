$(document).ready( async ()=> {
    try {
      const imagesContainer = $("#image-container");
      const images_input = document.getElementById("images-input");
      const thumbnail_input = document.getElementById("thumbnail-input");
      const thumbnail = $("#thumbnail");
      const titleField = $("#title");
      const contentField = $("#content");
      const textFieldsSubmitButton = $("#textFieldsSubmitButton");
      const deleteArticleButton = $("#deleteArticleButton");
      const url = window.location.pathname;
      const articleId = url.substring(url.lastIndexOf("/") + 1);
      const responseObject = await fetch(
        `http://localhost:9000/api/articles/${articleId}`
      );
      const article = await responseObject.json();
      if (responseObject.status === 401) {
        showMessage("You are not authenticated, login first...", "error");
        setTimeout(() => {
          window.location.href = "http://localhost:9000/login";
        }, 1000);
      }
      if(responseObject.status === 403){
          showMessage("authorization error for article", "error");
          setTimeout(() => {
            window.location.href = "http://localhost:9000/my_articles";
          }, 1000);
      }
      console.log(article);
      //fill thumbnail section
      thumbnail.attr("src", `/images/articles/thumbnails/${article.thumbnail}`);
      thumbnail_input.addEventListener("change", async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("thumbnail", thumbnail_input.files[0]);
        const responseObject = await fetch(
          `http://localhost:9000/api/articles/${articleId}`,
          {
            method: "PATCH",
            body: formData,
          }
        );
        const response = await responseObject.json();
        if (responseObject.status >= 400 && response.status < 600) {
          showMessage(response.message, "error");
        }
        if (responseObject.status === 200) {
          window.location.reload();
        }
      });
      //fill images section
      if (article.images && article.images.length > 0) {
        for (let i = 0; i < article.images.length; i++) {
          imagesContainer.append(
            `<div style=" display: inline-block; margin: 0 auto; width: 18%; height: 100%;"><img  style="width:100%; height:100%" src="/images/articles/images/${article.images[i]}" alt=""></div>`
          );
        }
      }

      //images-input on-change handler
      images_input.addEventListener("change", async (e) => {
        e.preventDefault();
        const formData = new FormData();

        for (let i = 0; i < images_input.files.length; i++) {
          formData.append("images", images_input.files[i]);
        }
        const responseObject = await fetch(
          `http://localhost:9000/api/articles/${articleId}`,
          {
            method: "PATCH",
            body: formData,
          }
        );
        const response = await responseObject.json();
        if (responseObject.status >= 400 && response.status < 600) {
          showMessage(response.message, "error");
        }
        if (responseObject.status === 200) {
          window.location.reload();
        }
      });

      //fill title field
      titleField.val(article.title);
      //fill content field
      contentField.val(article.content);

      //textFields submit buttun handler
      textFieldsSubmitButton.on("click", async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", titleField.val());
        formData.append("content", contentField.val());
        const responseObject = await fetch(
          `http://localhost:9000/api/articles/${articleId}`,
          {
            method: "PATCH",
            body: formData,
          }
        );
        const response = await responseObject.json();
        if (responseObject.status >= 400 && response.status < 600) {
          showMessage(response.message, "error");
        }
        if (responseObject.status === 200) {
          window.location.reload();
        }
      });

      //delete article buttun handler
      deleteArticleButton.on("click", async (e) => {
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
            window.location.href = `http://localhost:9000/my_articles`;
          }, 1000);

        }
      });
    } catch (error) {
      console.log(error);
  }
});