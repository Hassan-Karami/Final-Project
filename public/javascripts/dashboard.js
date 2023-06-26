$(document).ready(async function () {
  //genarate navbar
  const navBar_container = $("#navBar-container");
  const navBarComponent = await navBarGenerator();
  navBar_container.append(navBarComponent);

  function showMessage(message, type) {
    const $messageBox = $("#message-box");
    const $message = $messageBox.find(".message");

    // Set the message content and styling based on the type
    $message.text(message);
    if (type === "success") {
      $message.removeClass("error").addClass("success");
    } else if (type === "error") {
      $message.removeClass("success").addClass("error");
    }

    // Show the message box
    $messageBox.show();

    // Hide the message box after 3 seconds
    setTimeout(function () {
      $messageBox.hide();
    }, 2000);
  }

  // Accessing the form fields using jQuery
  const $firstNameField = $("#firstName");
  const $lastNameField = $("#lastName");
  const $roleField = $("#role");
  const $genderFields = $("#gender");
  const $usernameField = $("#username");
  const $phoneNumberInput = $("#phone_number");
  const $registrationDateField = $("#registration_date");
  const passUpdateBtn = $("#updatePassword-btn");

  //check session and get user info
  const responseObject = await fetch("http://localhost:9000/api/account");
  if (responseObject.status >= 400 && responseObject.status < 600) {
    const response = await responseObject.json();
    showMessage(response.message, "error");
    setTimeout(() => {
      window.location.href = "http://localhost:9000/login";
    }, 1500);
    return;
  }
  const userInfo = await responseObject.json();
  const userId = userInfo._id;
  // const userInfoObject = await fetch(`/api/account`);
  // const userInfo = await userInfoObject.json();
  console.log(userInfo);

  const card_title = $("#card-title");
  card_title.html(`${userInfo.firstName} ${userInfo.lastName}`);
  const avatar = $("#avatar");
  avatar.attr("src", `${userInfo.avatar}`);

  $firstNameField.val(userInfo.firstName);
  $lastNameField.val(userInfo.lastName);
  $usernameField.val(userInfo.username);
  $roleField.val(userInfo.role);
  $genderFields.val(userInfo.gender);
  $registrationDateField.val(userInfo.registration_date);
  $phoneNumberInput.val(userInfo.phone_number);

  //update userInfo button
  $("#update_btn").on("click", async (event) => {
    event.preventDefault();
    const updateRequestBody = {};
    //  if ($firstNameField.val()?.trim())
    updateRequestBody.firstName = $firstNameField.val();
    //  if ($lastNameField.val()?.trim())
    updateRequestBody.lastName = $lastNameField.val();
    //  if ($usernameField.val()?.trim())
    updateRequestBody.username = $usernameField.val();
    //  if ($phoneNumberInput.val()?.trim())
    updateRequestBody.phone_number = $phoneNumberInput.val();
    //  if ($roleField.val()?.trim())
    updateRequestBody.role = $roleField.val();
    //  if ($genderFields.val()?.trim())
    updateRequestBody.gender = $genderFields.val();

    const updateResponseObject = await fetch(
      `http://localhost:9000/api/account`,
      {
        method: "PATCH",
        body: JSON.stringify(updateRequestBody),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );

    if (
      updateResponseObject.status >= 400 &&
      updateResponseObject.status < 600
    ) {
      const updateResponse = await updateResponseObject.json();
      showMessage(updateResponse?.message, "error");
      console.log(updateResponse);
      return;
    }

    const updateResponse = await updateResponseObject.json();
    console.log(updateResponse);
    showMessage("user updated successfully", "success");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  });

  //updateAvatar form on submit
  const form = $("#updateAvatar_form");
  const fileInput = document.getElementById("selected_image");

  form.on("submit", async (event) => {
    event.preventDefault();
    console.log(fileInput.files);

    if (fileInput.files && fileInput.files.length > 0) {
      const formData = new FormData();
      formData.append("avatar", fileInput.files[0]);
      const avatarResponseObject = await fetch("api/account/uploadAvatar", {
        method: "POST",
        body: formData,
      });

      if (
        avatarResponseObject.status >= 400 &&
        avatarResponseObject.status < 600
      ) {
        const avatarResponse = await avatarResponseObject.json();
        showMessage(avatarResponse?.message, "error");
        if (avatarResponseObject.status === 401) {
          setTimeout(() => {
            return (window.location.href = "http://localhost:9000/login");
          }, 1500);
        }
      } else {
        showMessage("Profile Image Updated Sudccessfully", "success");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }

      // Send the form data to the server using the Fetch API or AJAX
    } else {
      // Handle case where no file is selected
      showMessage("No file selected", "error");
      console.log("No file selected");
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

  //Update Password Button handling
  passUpdateBtn.on("click", (event) => {
    event.preventDefault();
    window.location.href = `http://localhost:9000/${userId}/password`;
  });

  //Delete Button handling
  $("#delete_btn").on("click", async (event) => {
    try {
      event.preventDefault();
      const deleteRequestObject = await fetch(
        `http://localhost:9000/api/account`,
        {
          method: "DELETE",
        }
      );

      if (
        deleteRequestObject.status >= 500 &&
        deleteRequestObject.status < 600
      ) {
        const deleteUserResponse = await deleteRequestObject.json();
        showMessage(deleteUserResponse?.message, "error");
        return;
      }
      const deleteUserResponse = await deleteRequestObject.json();
      showMessage(
        `user with username "${deleteUserResponse.username}" deleted successfully`,
        "success"
      );
      await fetch("http://localhost:9000/api/auth/logout");
      setTimeout(() => {
        window.location.href = "http://localhost:9000/login";
      }, 1500);
    } catch (error) {
      console.log(error);
    }
  });
});
