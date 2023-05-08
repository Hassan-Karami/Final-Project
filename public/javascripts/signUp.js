$(document).ready(() => {
    
     function showMessage(message, type) {
      var $messageBox = $("#message-box");
      var $message = $messageBox.find(".message");

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
  const $genderFields = $('#gender');
  const $usernameField = $("#username");
  const $passwordField = $("#password");
  const $phoneNumberPrefix = $("#phone-number-prefix");
  const $phoneNumberInput = $("#phone_number");

  // Adding an event listener for the submit button
  $("#signup-form").on("submit", async(event) => {
    event.preventDefault();
    // Accessing the values of the form fields
    const firstNameValue = $firstNameField.val();
    const lastNameValue = $lastNameField.val();
    const roleValue = $roleField.val();
    const genderValue = $genderFields.val();
    const phoneNumberValue = $phoneNumberPrefix.text() + $phoneNumberInput.val();
    const usernameValue = $usernameField.val();
    const passwordValue = $passwordField.val();

    //post fetch request to api/users
        const requestBody = {
          username: usernameValue,
          password: passwordValue,
          firstName: firstNameValue,
          lastName: lastNameValue,
          role: roleValue,
          gender: genderValue,
          phone_number: phoneNumberValue,
        };

     const responseObject= await fetch("http://localhost:9000/api/users", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify(requestBody),
     });

     if(responseObject.status>=400 && responseObject.status<600){
         const response = await responseObject.json();
         console.log(response);
         showMessage(response.message,"error")
         return;
     }

     const response = await responseObject.json();
     showMessage("User Created Successfully","success")
     setTimeout(() => {
     window.location.href = "http://localhost:9000/login";
     }, 1000);
     console.log(response); 
  });

});
