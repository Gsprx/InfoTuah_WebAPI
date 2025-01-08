// get session items
const userData = sessionStorage.getItem("user");
const user = userData ? JSON.parse(userData) : null;

if (user) {
  const loginLink = document.getElementById("login-link");
  loginLink.innerHTML =
    user.username +
    `/ Logout <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff">
              <path d="M480-120v-80h280v-560H480v-80h280q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H480Zm-80-160-55-58 102-102H120v-80h327L345-622l55-58 200 200-200 200Z"></path>
            </svg>`;
  loginLink.href = "/";

  // logout
  loginLink.addEventListener("click", () => {
    var data = { username: user.username, sessionId: user.sessionId };
    logout(data);
  });
}

const logout = async (userData) => {
  try {
    const response = await fetch("http://localhost:8080/logout", {
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
      // remove from session storage
      if (sessionStorage.getItem("user")) {
        sessionStorage.removeItem("user");
      }
    } else {
      console.error("Something went wrong:", data.message);
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  }
};