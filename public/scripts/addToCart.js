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
        //send http request to server for adding item to cart
        const itemId = btn.getAttribute("data-id");
        console.log(`Item with id: ${itemId} added to the cart.`);
      });
    });
  }, 100); // 100ms delay
});

// observe changes to the document body
observer.observe(document.body, { childList: true, subtree: true });
