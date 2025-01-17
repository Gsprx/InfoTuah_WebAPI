import React from "react";
import ReactDOM from "react-dom";

// React component for the Cart Service
const Cart = async () => {
  //function to remove items from cart
  const removeItem = async (itemId) => {
    //send http request to server
    const reply = await fetch("http://localhost:8080/getCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userSession.username,
        itemId: itemId,
      }),
    });
  };
  //check if user session exists
  const userSession = JSON.parse(sessionStorage.getItem("user"));
  if (userSession == null) {
    return (
      <div class="invalid-session">
        <h1>Error: Invalid Session</h1>
      </div>
    );
  }

  //send http request to server
  const reply = await fetch("http://localhost:8080/getCart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: userSession.username,
      sessionId: userSession.sessionId,
    }),
  });

  // verify user session from server
  if (!reply.success) {
    return (
      <div class="invalid-session">
        <h1>Error: {reply.message}</h1>
      </div>
    );
  }
  const cartItems = reply.cartItems;
  // check if cart is empty
  if (cartItems.length == 0) {
    return <h1>Your cart is empty...</h1>;
  }
  const totalCost = reply.totalCost;
  return (
    <div>
      <h1>Items in your cart:</h1>
      <ul className="cart-list">
        {items.map((item) => (
          <li key={item.id}>
            <section>
              {item.type} | {item.title} | {item.cost}€
              <button onClick={() => removeItem(item.id)}>
                <svg
                  fill="#000000"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="12px"
                  height="12px"
                  viewBox="0 0 468.36 468.36"
                  xmlSpace="preserve"
                >
                  <g>
                    <g>
                      <path
                        d="M381.048,64.229l-71.396,0.031L309.624,0L158.666,0.064l0.027,64.26l-71.405,0.031l0.024,60.056h293.76L381.048,64.229z
               M189.274,30.652l89.759-0.04l0.016,33.66l-89.759,0.04L189.274,30.652z"
                      />
                      <path
                        d="M87.312,468.36h293.76V139.71H87.312V468.36z M303.042,184.588h15.301v238.891h-15.301V184.588z M226.542,184.588h15.3
              v238.891h-15.3V184.588z M150.042,184.588h15.3v238.891h-15.3V184.588z"
                      />
                    </g>
                  </g>
                </svg>
              </button>
            </section>
          </li>
        ))}
      </ul>
      <p> Total cost: {totalCost}€</p>
    </div>
  );
};

ReactDOM.render(<Cart />, document.getElementById("cart-root"));
