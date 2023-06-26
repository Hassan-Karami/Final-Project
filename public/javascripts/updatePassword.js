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

  //check session and redirect if user is not loggedIn
  const checkSessionResponseObject = await fetch(
    "http://localhost:9000/api/auth/check_session"
  );

  if (checkSessionResponseObject.status !== 200) {
    showMessage("you are not logged in", "error");
    setTimeout(() => {
      return (window.location.href = "http://localhost:9000/login");
    }, 1500);
  }

  const currentPasswordField = $("#current-password");
  const newPasswordField = $("#new-password");
  const confirmPasswordField = $("#confirm-password");

  //form Submittion handling
  const updatePasswordForm = $("#update_password-form");
  updatePasswordForm.on("submit", async (event) => {
    event.preventDefault();
    //check session and redirect if user is not loggedIn
    const checkSessionResponseObject = await fetch(
      "http://localhost:9000/api/auth/check_session"
    );

    if (checkSessionResponseObject.status !== 200) {
      showMessage("you are not logged in", "error");
      setTimeout(() => {
        return (window.location.href = "http://localhost:9000/login");
      }, 1500);
    }

    //validations

    //empty fields error
    if (
      !newPasswordField.val()?.trim() ||
      !currentPasswordField.val()?.trim() ||
      !confirmPasswordField.val()?.trim()
    ) {
      return showMessage("Error:empty field", "error");
    }

    //confirm  and new password difference error
    if (newPasswordField.val() !== confirmPasswordField.val()) {
      return showMessage("confirmed password is wrong", "error");
    }

    //new password regex
    const validPassword = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(
      newPasswordField.val()
    );
    if (!validPassword) {
      return showMessage(
        "Password must have at least 8 characters containing at least 1 letter and 1 digit.",
        "error"
      );
    }

    const updatePasswordBody = {
      current_password: currentPasswordField.val(),
      new_password: newPasswordField.val(),
    };
    //send request to server
    const updatePasswordResponseObject = await fetch(
      `http://localhost:9000/api/account/password`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePasswordBody),
      }
    );

    if (
      updatePasswordResponseObject.status >= 400 &&
      updatePasswordResponseObject.status < 600
    ) {
      const updatePasswordResponse = await updatePasswordResponseObject.json();
      console.log(updatePasswordResponse);
      return showMessage(updatePasswordResponse.message, "error");
    }

    const updatePasswordResponse = await updatePasswordResponseObject.json();
    showMessage(updatePasswordResponse.message, "success");
    setTimeout(() => {
      window.location.href = "http://localhost:9000/login";
    }, 1500);
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

