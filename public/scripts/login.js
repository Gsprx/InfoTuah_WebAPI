const loginBtn = document.getElementById("login-btn");
loginBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const username = document.getElementById("l_username");
  const password = document.getElementById("l_password");

  const userData = {
    username: username.value,
    password: password.value,
  };

  login(userData);
});

const login = async (userData) => {
  try {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok && response.status != 401) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      console.log("Login successful:", data.message);
      console.log("UUID:", data.sessionId);
      // store user, session ID to session storage
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          username: userData.username,
          sessionId: data.sessionId,
        })
      );
      window.location.href = "/";
    } else {
      console.error("Login failed:", data.message);
      const errorMessage = document.querySelector(".error-message");
      errorMessage.innerHTML = data.message;
      errorMessage.style.color = "red";
      errorMessage.style.fontSize = "1em";
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
};
