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
