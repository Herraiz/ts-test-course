enum AuthError {
  WRONG_CREDENTIALS,
  SERVER_FAIL,
  EXPIRED_SESSION,
  UNEXPECTED_ERROR,
}

console.log(AuthError.WRONG_CREDENTIALS); // 0
console.log(AuthError[0]); // WRONG_CREDENTIALS
console.log(AuthError[AuthError.WRONG_CREDENTIALS]); // WRONG_CREDENTIALS

enum AuthError2 {
  WRONG_CREDENTIALS = "Wrong credentials!",
  SERVER_FAIL = "Server failed!",
  EXPIRED_SESSION = "Expired session!",
}

function handleError(error: AuthError): void {
  switch (error) {
    case AuthError.EXPIRED_SESSION:
      console.log(AuthError2.EXPIRED_SESSION);
      break;
    case AuthError.SERVER_FAIL:
      console.log(AuthError2.SERVER_FAIL);
      break;
    case AuthError.WRONG_CREDENTIALS:
      console.log(AuthError2.WRONG_CREDENTIALS);
    case AuthError.UNEXPECTED_ERROR:
    default:
      console.log("Unexpected error");
      break;
  }
}

handleError(AuthError.WRONG_CREDENTIALS);
