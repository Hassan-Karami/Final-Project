$(document).ready(async function(){

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


  //check session
  const responseObject = await fetch("http://localhost:9000/api/check_session");
  if (responseObject.status >= 400 && responseObject.status < 600) {
    const response = await responseObject.json();
    showMessage(response.message, "error");
    setTimeout(() => {
      window.location.href = "http://localhost:9000/login";
    }, 1500);
    return;
  }
  const response = await responseObject.json();
  const userId = response._id;
  const userInfoObject = await fetch(`/api/users/${userId}`);
  const userInfo = await userInfoObject.json();
  console.log(userInfo);

  $firstNameField.val(userInfo.firstName);
  $lastNameField.val(userInfo.lastName);
  $usernameField.val(userInfo.username);
  $roleField.val(userInfo.role);
  $genderFields.val(userInfo.gender);
  $registrationDateField.val(userInfo.registration_date);
  $phoneNumberInput.val(userInfo.phone_number)

  //update userInfo button 
  const userInfo_form = $("#userInfo-form").on("submit",async (event)=>{
    event.preventDefault();
     const updateRequestBody = {};
     if ($firstNameField.val()?.trim())
       updateRequestBody.firstName = $firstNameField.val();
     if ($lastNameField.val()?.trim())
       updateRequestBody.lastName = $lastNameField.val();
     if ($usernameField.val()?.trim())
       updateRequestBody.username = $usernameField.val();
     if ($phoneNumberInput.val()?.trim())
       updateRequestBody.phone_number = $phoneNumberInput.val();
     if ($roleField.val()?.trim()) updateRequestBody.role = $roleField.val();
     if ($genderFields.val()?.trim())
       updateRequestBody.gender = $genderFields.val();

       

  })
 

//logout button handling
  const logoutButton = $("#logout-btn");
  logoutButton.on("click", async (e) => {
    try {
      await fetch("http://localhost:9000/api/logout");
    } catch (error) {}
  });

  // const responseObject = await fetch("http://localhost:9000/api/users/:", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(requestBody),
  // });
})