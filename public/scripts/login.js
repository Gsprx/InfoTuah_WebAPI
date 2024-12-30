const loginBtn = document.getElementById("login-btn");
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const username = document.getElementById("l_username");
  const password = document.getElementById("l_password");

  const data = {
    username: username,
    password: password,
  };
});
