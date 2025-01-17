const { useState, useEffect } = React; // Use React's hooks directly
const ReactDOM = window.ReactDOM; // Access ReactDOM via the window object

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); // Stores cart items
  const [totalCost, setTotalCost] = useState(0); // Stores total cost
  const [error, setError] = useState(null); // Tracks error messages

  const userSession = JSON.parse(sessionStorage.getItem("user"));
  if (!userSession) {
    setError("Invalid session");
    return;
  }

  // Function to remove an item from the cart
  const removeItem = async (itemId) => {
    try {
      const response = await fetch("http://localhost:8080/removeItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userSession.username,
          itemId: itemId,
        }),
      });

      const result = await response.json();
      if (result.success) {
        // Update the States data
        setCartItems(result.cartItems);
        setTotalCost(result.totalCost);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An error occurred while removing the item.");
    }
  };

  // Fetch cart data when the component mounts
  useEffect(() => {
    async function fetchCart() {
      try {
        const response = await fetch("http://localhost:8080/getCart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userSession.username,
            sessionId: userSession.sessionId,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setCartItems(result.cartItems);
          setTotalCost(result.totalCost);
        } else {
          setError(result.message);
        }
      } catch (err) {
        setError("An error occurred while fetching the cart data.");
      }
    }

    fetchCart();
  }, []); // Empty dependency array ensures this runs only once on mount

  // Render the component
  if (error) {
    return (
      <div className="error">
        <h1>Error: {error}</h1>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return <h1>Your cart is empty...</h1>;
  }

  return (
    <div className="cart-list">
      <h1>Items in your cart:</h1>
      <ul>
        {cartItems.map((item) => (
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
                  width="24px"
                  height="24px"
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
      <p>Total cost: {totalCost}€</p>
    </div>
  );
};

// Render the Cart component
const container = document.getElementById("cart-root");
const root = ReactDOM.createRoot(container);
root.render(<Cart />);
