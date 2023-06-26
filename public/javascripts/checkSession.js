async function checkSession() {
  const checkSessionRequestObject = await fetch(
    "http://localhost:9000/api/auth/check_session"
  );
  const checkSessionResponse = await checkSessionRequestObject.json();
  if (checkSessionRequestObject.status === 200) {
    return checkSessionResponse;
  } else {
    return false;
  }
}
