$(document).ready(async function(){


  //updateAvatar form on submit
  const form = $("#updateAvatar_form");
  const fileInput = document.getElementById("selected_thumbnail");

  form.on("submit", async (event) => {
    event.preventDefault();
    console.log(fileInput.files);

    if (fileInput.files && fileInput.files.length > 0) {
      const formData = new FormData();
      formData.append("thumbnail", fileInput.files[0]);
      const thumbnailResponseObject = await fetch(
        "api/articles/thumbnail",
        {
          method: "POST",
          body: formData,
        }
      );

      const thumbnail = await thumbnailResponseObject.json();
      console.log(thumbnail);

    } else {
      // Handle case where no file is selected
      console.log("No file selected");
    }
  });
})