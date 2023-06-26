$(document).ready(async function () {
  try {
    const navBar_container = $("#navBar-container");
    const navBarComponent = await navBarGenerator();
    navBar_container.append(navBarComponent);

    const commentBoxesContainer = $("#commentBoxesContainer");
    const comment_img = $("#comment_img");
    const comment_msg = $("#comment_msg");
    const postCommentButto = $("#postCommentButton");
    const url = window.location.pathname;
    const articleId = url.substring(url.lastIndexOf("/") + 1);
    const data = await fetch(`http://localhost:9000/api/articles/${articleId}`);
    if (data.status !== 200) {
      showMessage("an error eccured", "error");
    }

    let isAdmin = false;

    // check session and get userId if user is LoggedIn
    let userId;
    const checkSessionObject = await fetch(
      "http://localhost:9000/api/auth/check_session"
    );
    const checkSessionResponse = await checkSessionObject.json();
    if (checkSessionObject.status === 200) {
      userId = checkSessionResponse._id;
      console.log("user id is: " + userId);
    }
    if (
      checkSessionObject.status === 200 &&
      checkSessionResponse.role === "admin"
    ) {
      isAdmin = true;
    }

    const article = await data.json();
    console.log(article);
    const thumbnail = $("#thumbnail");
    const imagesContainer = $("#image-container");
    const content = $("#content");
    const title = $("#title");
    const author = $("#author");
    const createdAt = $("#createdAt");

    thumbnail.attr("src", `/images/articles/thumbnails/${article.thumbnail}`);
    content.html(article.content);
    title.html(article.title);
    author.html(article.author.firstName + " " + article.author.lastName);
    createdAt.html(article.registration_date.split("T")[0]);

    if (article.images && article.images.length > 0) {
      for (let i = 0; i < article.images.length; i++) {
        imagesContainer.append(
          `<div style=" display: inline-block; margin: 0 auto; width: 18%; height: 100%;"><img  style="width:100%; height:100%" src="/images/articles/images/${article.images[i]}" alt=""></div>`
        );
      }
    }

    const responseObject = await fetch(
      `http://localhost:9000/api/articles/${articleId}/comments`
    );
    const comments = await responseObject.json();
    for (let i = 0; i < comments.length; i++) {
      if (comments[i].user._id === userId || isAdmin === true) {
        commentBoxesContainer.append(
          `<div class="comment mt-4 text-justify float-left">
                    <img id="comment_img" src="${
                      comments[i].user.avatar
                    }" alt="" class="rounded-circle" width="40" height="40">
                    <h4>${
                      comments[i].user.firstName +
                      "" +
                      comments[i].user.lastName
                    }</h4>
                    <span>${comments[i].createdAt.split("T")[0]}</span>
                    <br>
                    
                    <div class="form-floating">
  <textarea class=" mt-2 form-control" id="updateInput-${
    comments[i]._id
  }" style="height: 100px">${comments[i].content}</textarea>
  
</div>

        <div class="d-flex flex-row justify-content-end mt-3">
        <button  onclick= requestToUpdateComment("${
          comments[i]._id
        }")  type="submit" class="btn btn-primary">Update</button>
        <button onclick = requestToDeleteComment("${
          comments[i]._id
        }")  type="submit" class="btn btn-danger">Delete</button>
      </div>
                    
                </div>`
        );
      } else {
        commentBoxesContainer.append(
          `<div class="comment mt-4 text-justify float-left">
                    <img id="comment_img" src="${
                      comments[i].user.avatar
                    }" alt="" class="rounded-circle" width="40" height="40">
                    <h4>${
                      comments[i].user.firstName +
                      "" +
                      comments[i].user.lastName
                    }</h4>
                    <span>${comments[i].createdAt.split("T")[0]}</span>
                    <br>
                    <p class="mt-2">${comments[i].content}</p>
                    
                </div>`
        );
      }
    }

    //handle click on post comment button
    postCommentButto.on("click", async (e) => {
      e.preventDefault();
      const content = comment_msg.val();
      const responseObject = await fetch("http://localhost:9000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, articleId }),
      });

      const response = await responseObject.json();
      console.log(response);
      if (responseObject.status >= 400 && responseObject.status < 600) {
        showMessage(response.message, "error");
      }
      if (responseObject.status === 201) {
        showMessage("comment added successfully", "success");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    });

    //search button handling
    const search_input = $("#search_input");

    const search_btn = $("#search_btn");

    search_btn.on("click", async (e) => {
      e.preventDefault();
      const searchInputText = search_input.val().trim();
      window.location.href = `http://localhost:9000?search=${searchInputText}`;
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
    console.log(error);
  }
});

async function requestToUpdateComment(commentId) {
  const content = $(`#updateInput-${commentId}`).val();
  const updateCommentRequestObject = await fetch(
    `http://localhost:9000/api/comments/${commentId}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    }
  );
  const updateCommentResponse = await updateCommentRequestObject.json();
  if (updateCommentRequestObject.status === 200) {
    showMessage("comment updated successfully", "success");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
  console.log(updateCommentResponse);
}


async function requestToDeleteComment(commentId) {
  const deleteCommentRequestObject = await fetch(
    `http://localhost:9000/api/comments/${commentId}`,
    {
      method: "DELETE",
    }
  );
  const deleteCommentResponse = await deleteCommentRequestObject.json();
  if (deleteCommentRequestObject.status === 200) {
    showMessage("comment deleted successfully", "success");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
  console.log(deleteCommentResponse);
}
