$(document).ready(async function () {
  //genarate navbar
  const navBar_container = $("#navBar-container");
  const navBarComponent = await navBarGenerator();
  navBar_container.append(navBarComponent);

  const form = $("form");
  const titleField = $("#title");
  const contentField = $("#content");
  const selectedThumbnail = document.getElementById("thumbnail");
  const selectedImages = document.getElementById("images");

  //check session and throw user if session is false
  const isLoggedin = await checkSession();
  if (!isLoggedin) {
    showMessage("You are not logged in", "error");
    setTimeout(() => {
      window.location.href = "http://localhost:9000/login";
    }, 1000);
  }

  form.on("submit", async (e) => {
    e.preventDefault();
    formData = new FormData();
    formData.append("title", titleField.val());
    formData.append("content", contentField.val());
    formData.append("thumbnail", selectedThumbnail.files[0]);
    for (let i = 0; i < selectedImages.files.length; i++) {
      formData.append("images", selectedImages.files[i]);
    }

    //send form-data with fetch
    const responseObject = await fetch("http://localhost:9000/api/articles", {
      method: "POST",
      body: formData,
    });
    const response = await responseObject.json();
    if (responseObject.status >= 400 && responseObject.status < 600) {
      return showMessage(response.message, "error");
    }
    console.log(response.data);
    showMessage(response.status, "success");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
});
