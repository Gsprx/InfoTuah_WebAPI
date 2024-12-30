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
      btn.addEventListener("click", () => {
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
        //add item to cart

        const itemId = btn.getAttribute("data-id");
        //send http request to server for adding item to cart
        console.log(`Item with id: ${itemId} added to the cart.`);
      });
    });
  }, 100); // 100ms delay
});

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
  return true;
}

// observe changes to the document body
observer.observe(document.body, { childList: true, subtree: true });
