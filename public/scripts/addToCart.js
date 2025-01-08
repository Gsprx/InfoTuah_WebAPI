// the mutation observer will run its code every time a change is observed
// this means that we will execute the same code multiple times if done without timeouts
// we use the timeout logic to only execute the observer code (button listerner binding) once
// we ensure that the observer’s callback is executed only once, after a certain amount of time has passed without new mutations

let debounceTimeout;
// constantly refresh the debounceTimeout variable with every observer call

const observer = new MutationObserver(() => {
  //clears any pending or previous timeout to avoid redundant executions
  clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(() => {
    const buttons = document.querySelectorAll(".add-to-cart-btn");
    buttons.forEach((btn) => {
      //ensure no duplicate listeners are added to buttons
      if (!btn.classList.contains("listener-attached")) {
        btn.addEventListener("click", async () => {
          if (!userLoggedIn()) {
            //user not logged in
            //show error message
            const closeError = document.querySelector(".close-error-button");
            closeError.addEventListener("click", () => {
              hideError();
            });
            showError("User must be logged in to add items to cart.");
            return;
          }
          //user logged in

          const user = JSON.parse(sessionStorage.getItem("user"));
          const cartData = {
            username: user.username,
            itemId: btn.getAttribute("data-id"),
            sessionId: user.sessionId,
            itemType: btn.getAttribute("data-type"),
            itemCost: btn.getAttribute("data-cost"),
            itemTitle: btn.getAttribute("data-title"),
          };
          console.log("Cart Details: ", cartData);

          const reply = await addToCart(cartData);
          //check if item was already in the cart
          if (reply.success == true) {
            //show notification
            const closeNotif = document.querySelector(
              ".close-cart-notification"
            );
            closeNotif.addEventListener("click", () => {
              hideNotification();
            });
            showCartNotification(reply.message);
          } else {
            //show error
            const closeError = document.querySelector(".close-error-button");
            closeError.addEventListener("click", () => {
              hideError();
            });
            showError(reply.message);
          }
        });
        btn.classList.add("listener-attached");
      }
    });
  }, 100); // 100ms delay
});

// send request to add item to user's cart
async function addToCart(cartData_) {
  try {
    //send http request to server for adding item to cart
    const response = await fetch("http://localhost:8080/addToCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cartData_),
    });
    if (!response.ok && response.status != 403 && response.status != 409) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("An error occurred:", error.message);
    return { success: false, message: "A network error occurred." };
  }
}

// show notification box after adding an item to cart
function showCartNotification(message) {
  const notifBox = document.querySelector(".cart-notification");
  const notifMessage = document.querySelector(".cart-notification-message");
  notifMessage.textContent = message;
  notifBox.style.display = "block";
}

//hide notification box
function hideNotification() {
  const notifBox = document.querySelector(".cart-notification");
  notifBox.style.display = "none";
}

// show generic error box with given text as error message
function showError(errorText) {
  const errorBox = document.querySelector(".error-container");
  const errorMessage = document.querySelector(".error-message");
  errorMessage.textContent = errorText;
  errorBox.style.display = "block";
}

//hide error box
function hideError() {
  const errorBox = document.querySelector(".error-container");
  errorBox.style.display = "none";
}

function userLoggedIn() {
  return sessionStorage.getItem("user") != null;
}

// observe changes to the document body
observer.observe(document.body, { childList: true, subtree: true });
