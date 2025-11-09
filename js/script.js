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


const PRODUCTS = [
  { id: 'p1', title:'Full Frontal Natural Wave', category:'full frontal', price:200, rating:4.7, img:'assets/_image/bubblegum pink.jpg' },
  { id: 'p2', title:'Afro-Kinky', category:'afro-kinky', price:310, rating:4.2, img:'assets/_image/Jett.jpg' },
  { id: 'p3', title:'Headband Wig', category:'headband wigs', price:250, rating:4.9, img:'assets/_image/Julia.jpg' },
  { id: 'p4', title:'Naartjie', category:'curly hair', price:350, rating:4.6, img:'assets/_image/naartjie.jpg' },
  { id: 'p5', title:'Bob', category:'ful frontal', price:320, rating:4.1, img:'assets/_image/nina.jpg' },
  { id: 'p6', title:'Headband Wig - Easy Wear', category:'headband wigs', price:450, rating:4.0, img:'assets/_image/piano jerry curls.jpg' },
  { id: 'p7', title:'Scarlett', category:'curly hair', price:210, rating:4.3, img:'assets/_image/scarlett.jpg' },
  { id: 'p8', title:'Summer Waves', category:'season collection', price:300, rating:4.8, img:'assets/_image/sexy red.jpg' }
];

/* ---------- Storage keys ---------- */
const KEY_CART = 'ee_cart_v2';
const KEY_FAV = 'ee_fav_v2';
const KEY_USER = 'ee_user_v2';
const KEY_ORDERS = 'ee_orders_v2';

/* ---------- Helpers ---------- */
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));
const currency = n => `R ${Number(n).toFixed(2)}`;
function imgFallback(e){ e.target.src = 'assets/images/placeholder.jpg'; }

/* ---------- Load / Save ---------- */
function loadCart(){ return JSON.parse(localStorage.getItem(KEY_CART) || '[]'); }
function saveCart(c){ localStorage.setItem(KEY_CART, JSON.stringify(c)); updateCartBadges(); }
function loadFav(){ return JSON.parse(localStorage.getItem(KEY_FAV) || '[]'); }
function saveFav(f){ localStorage.setItem(KEY_FAV, JSON.stringify(f)); updateFavBadges(); }
function loadUser(){ return JSON.parse(localStorage.getItem(KEY_USER) || '{}'); }
function saveUser(u){ localStorage.setItem(KEY_USER, JSON.stringify(u)); }
function loadOrders(){ return JSON.parse(localStorage.getItem(KEY_ORDERS) || '[]'); }
function saveOrders(o){ localStorage.setItem(KEY_ORDERS, JSON.stringify(o)); }

/* ---------- Toast ---------- */
function toast(msg, timeout=1500){
  const t = document.createElement('div');
  t.className = 'ee-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(()=> t.classList.add('show'));
  setTimeout(()=> { t.classList.remove('show'); setTimeout(()=> t.remove(),300) }, timeout);
}

/* ---------- Bounce icon ---------- */
function bounceIcon(sel){
  const el = $(sel);
  if(!el) return;
  el.classList.add('bounce');
  setTimeout(()=> el.classList.remove('bounce'), 650);
}

/* ---------- Hamburger Dropdown ---------- */
function initHamburger(){
  const burgers = $$('.hamburger');
  burgers.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const nav = document.querySelector('.main-nav');
      if(nav) nav.classList.toggle('show');
      btn.classList.toggle('active');
    });
  });
}

/* ---------- Scroll animations (IntersectionObserver) ---------- */
function initScrollAnimations(){
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('animate');
    });
  }, {threshold:0.18});
  $$('[data-animate]').forEach(el => observer.observe(el));
  $$('.product-card').forEach(el => observer.observe(el));
}

/* ---------- Update badges (cart/fav counts) ---------- */
function updateCartBadges(){
  const count = loadCart().reduce((s,it)=>s+it.qty,0);
  $$('#cart-count, #cart-count-shop, #cart-count-prod, #cart-count-cart, #cart-count-wish, #cart-count-acc, #cart-count-checkout')
    .forEach(i=>{ if(i) i.textContent = count; });
}

function updateFavBadges(){
  const count = loadFav().length;
  $$('#fav-count, #fav-count-shop, #fav-count-prod, #fav-count-cart, #fav-count-wish, #fav-count-acc')
    .forEach(i=>{ if(i) i.textContent = count; });
}

/* ---------- Render helpers (card) ---------- */
function createProductCard(p){
  const card = document.createElement('div');
  card.className = 'product-card';
  card.setAttribute('data-animate','');
  card.innerHTML = `
    <img src="${p.img}" alt="${p.title}" onerror="this.src='assets/images/placeholder.jpg'">
    <div class="product-info">
      <h3>${p.title}</h3>
      <div class="price">${currency(p.price)}</div>
      <div class="small">Rating: ${p.rating}</div>
      <div style="margin-top:8px;">
        <button class="btn add-cart" data-id="${p.id}">Add to cart</button>
        <button class="btn secondary add-fav" data-id="${p.id}">♡</button>
        <a class="btn" href="product.html?id=${encodeURIComponent(p.id)}">View</a>
      </div>
    </div>
  `;
  return card;
}

/* ---------- Render shop grid (on shop.html) ---------- */
function renderShopGrid(products){
  const container = $('#shop-grid') || $('#bestseller-grid') || $('.products');
  if(!container) return;
  container.innerHTML = '';
  const list = (products || PRODUCTS);
  list.forEach(p => container.appendChild(createProductCard(p)));
  initScrollAnimations();
}

/* ---------- Add to cart / fav ---------- */
function addToCartById(id, qty=1){
  const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
  let cart = loadCart();
  const found = cart.find(it=>it.id===id);
  if(found) found.qty += qty; else cart.push({ id:p.id, title:p.title, price:p.price, img:p.img, qty });
  saveCart(cart);
  toast(`${p.title} added to cart`);
  bounceIcon('#cart-icon');
}

function addToFavById(id){
  const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
  let fav = loadFav();
  if(fav.find(it=>it.id===id)){ toast('Already in favourites'); return; }
  fav.push({ id:p.id, title:p.title, price:p.price, img:p.img });
  saveFav(fav);
  toast(`${p.title} added to favourites`);
  bounceIcon('#favourites-icon');
}

/* ---------- Render product detail (product.html) ---------- */
function renderProductDetail(){
  const container = $('#product-detail'); if(!container) return;
  const params = new URLSearchParams(location.search); const id = params.get('id');
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p){ container.innerHTML = '<p>Product not found</p>'; return; }
  container.innerHTML = `
    <div class="product-detail">
      <div class="left">
        <img src="${p.img}" alt="${p.title}" onerror="this.src='assets/images/placeholder.jpg'">
      </div>
      <div class="product-info">
        <h1>${p.title}</h1>
        <div class="price">${currency(p.price)}</div>
        <p class="small">Category: ${p.category} • Rating: ${p.rating}</p>
        <p style="margin-top:12px">High-quality wig, natural hairline, breathable cap.</p>
        <div style="margin-top:12px;display:flex;gap:8px;align-items:center">
          <input id="prod-qty" type="number" value="1" min="1" style="width:80px;padding:8px;border-radius:8px;border:1px solid #eee">
          <button id="prod-add" class="btn" data-id="${p.id}">Add to Cart</button>
          <button id="prod-fav" class="btn secondary" data-id="${p.id}">♡</button>
        </div>
      </div>
    </div>
  `;
  // events:
  $('#prod-add')?.addEventListener('click', ()=> {
    const qty = Number($('#prod-qty').value)||1;
    addToCartById(p.id, qty);
  });
  $('#prod-fav')?.addEventListener('click', ()=> addToFavById(p.id));
}

/* ---------- Cart page rendering (cart.html) ---------- */
function renderCartPage(){
  const area = $('#cart-area'); if(!area) return;
  const cart = loadCart();
  if(cart.length===0){ area.innerHTML = '<p class="small">Cart is empty. <a href="shop.html">Shop now</a></p>'; return; }
  const table = document.createElement('table'); table.style.width='100%';
  let html = `<thead><tr><th>Select</th><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th>Actions</th></tr></thead><tbody>`;
  cart.forEach((it, idx)=>{
    html += `<tr>
      <td><input class="select-item" data-index="${idx}" type="checkbox" checked></td>
      <td style="display:flex;align-items:center;gap:10px"><img src="${it.img}" onerror="this.src='assets/images/placeholder.jpg'" style="width:70px;height:50px;object-fit:cover;border-radius:6px"><div>${it.title}</div></td>
      <td>${currency(it.price)}</td>
      <td><input class="qty" data-index="${idx}" type="number" min="1" value="${it.qty}" style="width:72px;padding:6px;border-radius:6px;border:1px solid #eee"></td>
      <td>${currency(it.price * it.qty)}</td>
      <td><button class="btn move-fav" data-index="${idx}">♡ Fav</button> <button class="btn secondary remove-item" data-index="${idx}">Remove</button></td>
    </tr>`;
  });
  html += `</tbody>`;
  table.innerHTML = html;
  area.innerHTML = ''; area.appendChild(table);

  // Summary
  const subtotal = cart.reduce((s,i)=>s+i.price*i.qty,0);
  $('#cart-summary').innerHTML = `<div class="small">Subtotal: <strong>${currency(subtotal)}</strong></div>
    <div style="margin-top:8px;"><button id="checkout-btn" class="btn">Checkout selected</button> <button id="clear-cart" class="btn secondary">Clear cart</button></div>`;

  // events:
  $$('.qty').forEach(inp => inp.addEventListener('change', e=>{
    const idx = Number(e.target.dataset.index), val = Math.max(1, Number(e.target.value));
    const cart = loadCart(); cart[idx].qty = val; saveCart(cart); renderCartPage();
  }));
  $$('.remove-item').forEach(btn => btn.addEventListener('click', e=>{
    const idx = Number(e.target.dataset.index); let cart = loadCart(); cart.splice(idx,1); saveCart(cart); renderCartPage();
  }));
  $$('.move-fav').forEach(btn => btn.addEventListener('click', e=>{
    const idx = Number(e.target.dataset.index); const cart = loadCart(); addToFavById(cart[idx].id); cart.splice(idx,1); saveCart(cart); renderCartPage();
  }));

  $('#clear-cart')?.addEventListener('click', ()=> { if(confirm('Clear cart?')){ saveCart([]); renderCartPage(); }});
  $('#checkout-btn')?.addEventListener('click', ()=> {
    const selected = Array.from($$('.select-item')).filter(s=>s.checked).map(s=>Number(s.dataset.index));
    if(selected.length===0){ alert('Select at least one item'); return; }
    sessionStorage.setItem('ee_checkout', JSON.stringify(selected));
    window.location.href = 'checkout.html';
  });
}

/* ---------- Wishlist render ---------- */
function renderWishlistPage(){
  const container = $('#wishlist-items'); if(!container) return;
  const fav = loadFav();
  if(fav.length===0){ container.innerHTML = '<p class="small">No favourites yet. <a href="shop.html">Shop</a></p>'; return; }
  container.innerHTML = '';
  fav.forEach((it, idx)=>{
    const div = document.createElement('div'); div.className='fav-item';
    div.innerHTML = `<img src="${it.img}" onerror="this.src='assets/images/placeholder.jpg'"><div style="flex:1"><h4>${it.title}</h4><div class="small">${currency(it.price)}</div><div style="margin-top:8px"><button class="btn fav-to-cart" data-index="${idx}">Add to cart</button> <button class="btn secondary fav-remove" data-index="${idx}">Remove</button></div></div>`;
    container.appendChild(div);
  });
  $$('.fav-to-cart').forEach(b=>b.addEventListener('click', e=>{
    const idx = Number(e.target.dataset.index); const fav = loadFav(); addToCartById(fav[idx].id, 1); fav.splice(idx,1); saveFav(fav); renderWishlistPage();
  }));
  $$('.fav-remove').forEach(b=>b.addEventListener('click', e=>{
    const idx = Number(e.target.dataset.index); let fav = loadFav(); fav.splice(idx,1); saveFav(fav); renderWishlistPage();
  }));
}

/* ---------- Account page ---------- */
function renderAccountPage(){
  const user = loadUser();
  if($('#acc-name')) $('#acc-name').value = user.name || '';
  if($('#acc-email')) $('#acc-email').value = user.email || '';
  if($('#acc-phone')) $('#acc-phone').value = user.phone || '';
  const ordersEl = $('#orders-list');
  if(ordersEl){
    const orders = loadOrders();
    if(orders.length===0){ ordersEl.innerHTML = '<p class="small">No orders yet.</p>'; return;}
    ordersEl.innerHTML = '';
    orders.slice().reverse().forEach(o=>{
      const div = document.createElement('div'); div.className='order-card'; div.innerHTML = `<strong>Order ${o.id}</strong><div class="small">Status: ${o.status} • ${o.date}</div><ul>${o.items.map(it=>`<li>${it.title} ×${it.qty} — ${currency(it.price)}</li>`).join('')}</ul><div class="small">Total: ${currency(o.total)}</div>`;
      ordersEl.appendChild(div);
    });
  }
}

/* ---------- Checkout logic (mock) ---------- */
function renderCheckoutPage(){
  const area = $('#checkout-area'); if(!area) return;
  const selectedIndexes = JSON.parse(sessionStorage.getItem('ee_checkout')||'[]');
  const cart = loadCart();
  const selectedItems = selectedIndexes.map(i=>cart[i]).filter(Boolean);
  if(selectedItems.length===0){ area.innerHTML = '<p class="small">No items selected.</p>'; return; }
  let subtotal = selectedItems.reduce((s,i)=>s + i.price * i.qty, 0);
  area.innerHTML = `<div><h3>Order Summary</h3><ul>${selectedItems.map(it=>`<li>${it.title} ×${it.qty} — ${currency(it.price * it.qty)}</li>`).join('')}</ul><p class="small">Subtotal: <strong>${currency(subtotal)}</strong></p></div>
    <form id="payment-form" style="margin-top:12px;max-width:420px">
      <input id="pay-name" placeholder="Cardholder name" required style="padding:8px;border-radius:8px;border:1px solid #eee;width:100%;margin-bottom:8px">
      <input id="pay-card" placeholder="Card number (mock)" required style="padding:8px;border-radius:8px;border:1px solid #eee;width:100%;margin-bottom:8px">
      <div style="display:flex;gap:8px"><input id="pay-exp" placeholder="MM/YY" required style="padding:8px;border-radius:8px;border:1px solid #eee;flex:1"><input id="pay-cvc" placeholder="CVC" required style="padding:8px;border-radius:8px;border:1px solid #eee;width:120px"></div>
      <button type="submit" class="btn" style="margin-top:10px">Pay ${currency(subtotal)}</button>
    </form>`;
  $('#payment-form')?.addEventListener('submit', e=>{
    e.preventDefault();
    // create order
    const orders = loadOrders();
    const orderId = 'OE' + Date.now();
    const order = { id: orderId, items:selectedItems.map(i=>({id:i.id,title:i.title,price:i.price,qty:i.qty})), total:subtotal, date:new Date().toLocaleString(), status:'Processing' };
    orders.push(order); saveOrders(orders);
    // remove from cart by indexes (descending)
    let newCart = cart.slice();
    selectedIndexes.sort((a,b)=>b-a).forEach(idx => newCart.splice(idx,1));
    saveCart(newCart);
    sessionStorage.removeItem('ee_checkout');
    toast('Payment successful — order placed');
    setTimeout(()=> location.href = 'account.html', 900);
  });
}

/* ---------- Global event delegation for add buttons on shop & index ---------- */
function attachDelegation(){
  document.addEventListener('click', (e)=>{
    const a = e.target.closest('.add-cart');
    if(a){ addToCartById(a.dataset.id,1); return; }
    const f = e.target.closest('.add-fav');
    if(f){ addToFavById(f.dataset.id); return; }
  });
}

/* ---------- Init across pages ---------- */
document.addEventListener('DOMContentLoaded', ()=>{
  // initial badges
  updateCartBadges(); updateFavBadges();

  // hamburger
  initHamburger();

  // attach global events
  attachDelegation();

  // scroll animations
  initScrollAnimations();

  // page-specific inits
  if($('#bestseller-grid') || $('.products')) {
    renderShopGrid();
    // if there's a bestseller container, render first 4
    const bs = $('#bestseller-grid');
    if(bs){ bs.innerHTML=''; PRODUCTS.slice(0,4).forEach(p => bs.appendChild(createProductCard(p))); initScrollAnimations(); }
  }
  if($('#shop-grid')) renderShopGrid();
  if($('#product-detail')) renderProductDetail();
  if($('#cart-area')) renderCartPage();
  if($('#wishlist-items')) renderWishlistPage();
  if($('#account-form')) { renderAccountPage(); $('#account-form').addEventListener('submit', e=>{
    e.preventDefault();
    const u={name:$('#acc-name').value, email:$('#acc-email').value, phone:$('#acc-phone').value};
    saveUser(u); toast('Account updated'); renderAccountPage();
  }); }
  if($('#checkout-area')) renderCheckoutPage();

  // image fallback
  $$('img').forEach(img => img.onerror = imgFallback);
});

