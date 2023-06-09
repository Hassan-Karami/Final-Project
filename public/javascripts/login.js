$(document).ready(async function () {
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

  //check session and dont let user to stay in login page if he is loggedin
  const responseObject = await fetch(
    "http://localhost:9000/api/auth/check_session"
  );
  console.log(responseObject.status);
  const userProperties = await responseObject.json();
  if (responseObject.status === 200 && userProperties.role === "admin") {
    console.log(userProperties);
    window.location.href = "http://localhost:9000/admin";
    return;
  } else if (
    responseObject.status === 200 &&
    userProperties.role === "blogger"
  ) {
    window.location.href = "http://localhost:9000/articles";
  }

  $("form").on("submit", async (event) => {
    event.preventDefault();
    const username = $("#username").val();
    const password = $("#password").val();
    const requestBody = { username, password };
    const responseObject = await fetch("http://localhost:9000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (responseObject.status >= 400 && responseObject.status < 600) {
      const response = await responseObject.json();
      console.log(response);
      showMessage(response.message, "error");
      return;
    }

    const response = await responseObject.json();
    if (response.role === "admin") {
      showMessage("successfull login", "success");
      setTimeout(() => {
        window.location.href = `http://localhost:9000/admin`;
      }, 1000);
    } else {
      showMessage("successfull login", "success");
      setTimeout(() => {
        window.location.href = `http://localhost:9000/articles`;
      }, 1000);
    }

    console.log(response);
  });
});
