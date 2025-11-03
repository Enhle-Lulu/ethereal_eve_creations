/* ============================
   ETHEREAL EVE - MAIN SCRIPT
   ============================ */

// --------- GLOBAL VARIABLES ----------
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let favourites = JSON.parse(localStorage.getItem("favourites")) || [];
let userAccount = JSON.parse(localStorage.getItem("userAccount")) || {
  name: "Guest User",
  email: "",
  address: "",
  orders: []
};

// --------- BURGER MENU ----------
const burger = document.querySelector(".burger");
const navMenu = document.querySelector(".nav-links");

if (burger && navMenu) {
  burger.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    burger.classList.toggle("active");
  });
}

// --------- SCROLL ANIMATIONS (FADE + SLIDE-UP) ----------
const animatedElements = document.querySelectorAll("[data-animate]");
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      }
    });
  },
  { threshold: 0.2 }
);

animatedElements.forEach(el => observer.observe(el));

// --------- ADD TO CART ----------
function addToCart(productId, productName, productPrice, productImage) {
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, name: productName, price: productPrice, image: productImage, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showToast(`${productName} added to cart 🛒`);
  bounceIcon("#cart-icon");
}

// --------- REMOVE FROM CART ----------
function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  showToast("Item removed from cart ❌");
  renderCart();
}

// --------- ADD TO FAVOURITES ----------
function addToFavourites(productId, productName, productPrice, productImage) {
  if (!favourites.some(item => item.id === productId)) {
    favourites.push({ id: productId, name: productName, price: productPrice, image: productImage });
    localStorage.setItem("favourites", JSON.stringify(favourites));
    showToast(`${productName} added to favourites 💖`);
    bounceIcon("#favourites-icon");
  } else {
    showToast(`${productName} is already in favourites!`);
  }
}

// --------- MOVE FAVOURITE TO CART ----------
function moveFavouriteToCart(productId) {
  const favItem = favourites.find(item => item.id === productId);
  if (favItem) {
    addToCart(favItem.id, favItem.name, favItem.price, favItem.image);
    favourites = favourites.filter(item => item.id !== productId);
    localStorage.setItem("favourites", JSON.stringify(favourites));
    renderFavourites();
  }
}

// --------- RENDER CART PAGE ----------
function renderCart() {
  const cartContainer = document.querySelector("#cart-container");
  if (!cartContainer) return;
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty 🛍️</p>";
    return;
  }

  cart.forEach(item => {
    const productEl = document.createElement("div");
    productEl.classList.add("cart-item");
    productEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>R${item.price}</p>
        <p>Qty: ${item.quantity}</p>
        <button onclick="removeFromCart('${item.id}')">Remove</button>
        <button onclick="addToFavourites('${item.id}','${item.name}',${item.price},'${item.image}')">Add to Favourites</button>
      </div>
    `;
    cartContainer.appendChild(productEl);
  });
}

// --------- RENDER FAVOURITES PAGE ----------
function renderFavourites() {
  const favContainer = document.querySelector("#favourites-container");
  if (!favContainer) return;
  favContainer.innerHTML = "";

  if (favourites.length === 0) {
    favContainer.innerHTML = "<p>No favourites yet 💅</p>";
    return;
  }

  favourites.forEach(item => {
    const favEl = document.createElement("div");
    favEl.classList.add("fav-item");
    favEl.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <p>R${item.price}</p>
        <button onclick="moveFavouriteToCart('${item.id}')">Move to Cart</button>
      </div>
    `;
    favContainer.appendChild(favEl);
  });
}

// --------- ACCOUNT PAGE ----------
function updateAccountInfo(name, email, address) {
  userAccount.name = name;
  userAccount.email = email;
  userAccount.address = address;
  localStorage.setItem("userAccount", JSON.stringify(userAccount));
  showToast("Account info updated 💫");
}

function renderAccountPage() {
  const nameInput = document.querySelector("#acc-name");
  const emailInput = document.querySelector("#acc-email");
  const addressInput = document.querySelector("#acc-address");

  if (nameInput && emailInput && addressInput) {
    nameInput.value = userAccount.name;
    emailInput.value = userAccount.email;
    addressInput.value = userAccount.address;
  }
}

// --------- TOAST NOTIFICATIONS ----------
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

// --------- ICON BOUNCE ANIMATION ----------
function bounceIcon(selector) {
  const icon = document.querySelector(selector);
  if (!icon) return;
  icon.classList.add("bounce");
  setTimeout(() => icon.classList.remove("bounce"), 600);
}

// --------- INIT ---------
window.addEventListener("DOMContentLoaded", () => {
  renderCart();
  renderFavourites();
  renderAccountPage();
});
