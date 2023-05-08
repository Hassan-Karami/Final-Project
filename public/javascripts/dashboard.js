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

    const logoutButton = $("#logout-btn");
    //check session
    const responseObject = await fetch("http://localhost:9000/api/dashboard");
    if(responseObject.status >= 400 && responseObject.status < 600){
        const response = await responseObject.json();
        showMessage(response.message,"error")
        setTimeout(() => {
          window.location.href = "http://localhost:9000/login";
          return;;
        }, 1000);
    }
    const response = await responseObject.json();

    logoutButton.on("click", async (e) => {
      try {
        await fetch("http://localhost:9000/api/logout");
      } catch (error) {
        
      }
    });

    // const responseObject = await fetch("http://localhost:9000/api/users/:", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(requestBody),
    // });
})