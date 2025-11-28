
// -------------------- PRODUCT DATA --------------------
const allProducts = [
  { id: 1, name: "Premium Cotton T-Shirt", price: 25.99, category: "Clothes", image: "./images/premiumcottonTshirt.webp" },
  { id: 2, name: "Slim Fit Jeans", price: 49.50, category: "Clothes", image: "./images/slimfitjean.webp" },
  { id: 3, name: "Smart Watch V2", price: 199.99, category: "Electronics", image: "./images/smartwatchv2.webp" },
  { id: 4, name: "Wireless Bluetooth Headphones", price: 79.99, category: "Electronics", image: "./images/wirelessbluetoothheadphones.jpg" },
  { id: 5, name: "Leather Wallet", price: 35.00, category: "Accessories", image: "./images/leatherwallet.webp" },
  { id: 6, name: "Sports Running Shoes", price: 89.99, category: "Footwear", image: "./images/footwear.webp" },
  { id: 7, name: "Classic Polo Shirt", price: 32.99, category: "Clothes", image: "./images/classicpoloshirt.jpeg" },
  { id: 8, name: "Gaming Mouse Pad", price: 15.00, category: "Electronics", image: "./images/gamingmousepad.jpeg" },
  { id: 9, name: "Wool Scarf", price: 18.50, category: "Accessories", image: "./images/woolscarf.jpeg" },
  { id: 10, name: "Casual Sneakers", price: 65.00, category: "Footwear", image: "./images/causalsneaker.jpeg" },
  { id: 11, name: "Portable SSD 1TB", price: 125.00, category: "Electronics", image: "./images/portablessd1tb.jpeg" },
  { id: 12, name: "Denim Jacket", price: 75.00, category: "Clothes", image: "./images/deniemjacket.jpeg" },
  { id: 13, name: "Silver Ring", price: 42.00, category: "Accessories", image: "./images/sliverring.jpeg" },
  { id: 14, name: "Formal Leather Shoes", price: 110.00, category: "Footwear", image: "./images/formalleathershoes.jpeg" },
  { id: 15, name: "4K LED Monitor", price: 349.99, category: "Electronics", image: "./images/4kledmonitor.jpeg" },
  { id: 16, name: "Summer Dress", price: 55.99, category: "Clothes", image: "./images/summerdress.jpeg" },
  { id: 17, name: "Travel Backpack", price: 69.99, category: "Accessories", image: "./images/travelbackpack.jpeg" },
  { id: 18, name: "Hiking Boots", price: 130.00, category: "Footwear", image: "./images/hiking boots.jpeg" },
  { id: 19, name: "USB-C Hub", price: 22.99, category: "Electronics", image: "./images/USB-Chub.jpeg" },
  { id: 20, name: "Hoodie Pullover", price: 40.00, category: "Clothes", image: "./images/hoodiepullover.jpeg" }
];

// -------------------- THEME HANDLING --------------------
const themeToggle = document.getElementById('theme-toggle');
function applySavedTheme() {
  const t = localStorage.getItem('theme');
  if (t === 'dark') document.body.classList.add('dark-mode');
  if (themeToggle) themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
}
applySavedTheme();
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  });
}

// -------------------- NAVBAR LOGGED USER --------------------
function updateNavUser() {
  const loginLink = document.getElementById('login-link');
  const user = localStorage.getItem('loggedInUser');
  if (!loginLink) return;
  if (user) {
    loginLink.textContent = `👤 ${user}`;
    loginLink.href = '#';
    loginLink.onclick = (e) => {
      e.preventDefault();
      if (confirm('Log out?')) {
        localStorage.removeItem('loggedInUser');
        window.location.reload();
      }
    };
  } else {
    loginLink.textContent = '👤 Login';
    loginLink.href = 'login.html';
    loginLink.onclick = null;
  }
}
updateNavUser();

// -------------------- CART STORAGE & HELPERS --------------------
function getCart() {
  // cart stored as array of { id, qty }
  return JSON.parse(localStorage.getItem('cart')) || [];
}
function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}
function findProductById(id) {
  return allProducts.find(p => p.id === Number(id));
}

// Add to cart: increments qty if present
function addToCart(id) {
  const prod = findProductById(id);
  if (!prod) return;
  const cart = getCart();
  const existing = cart.find(i => i.id === prod.id);
  if (existing) existing.qty += 1;
  else cart.push({ id: prod.id, qty: 1 });
  saveCart(cart);
  // Notify user — for production replace alert with custom toast
  alert(`${prod.name} added to cart`);
  // If on cart page, re-render
  if (document.getElementById('cart-container')) renderCart();
}

// Update item qty (delta can be +1 or -1)
function updateQuantity(id, delta) {
  let cart = getCart();
  const idx = cart.findIndex(i => i.id === Number(id));
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart(cart);
  if (document.getElementById('cart-container')) renderCart();
}

// Remove item
function removeItem(id) {
  let cart = getCart().filter(i => i.id !== Number(id));
  saveCart(cart);
  if (document.getElementById('cart-container')) renderCart();
}

// -------------------- RENDER PRODUCTS (shop.html) --------------------
function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const categoryFilter = document.getElementById('category-filter');
  const priceFilter = document.getElementById('price-filter');
  const searchBox = document.getElementById('search-box');

  function display() {
    const cat = categoryFilter?.value || 'All';
    const sort = priceFilter?.value || 'default';
    const search = (searchBox?.value || '').toLowerCase();

    let filtered = allProducts.filter(p => {
      return (cat === 'All' || p.category === cat) &&
             p.name.toLowerCase().includes(search);
    });

    if (sort === 'low-high') filtered.sort((a,b)=> a.price - b.price);
    if (sort === 'high-low') filtered.sort((a,b)=> b.price - a.price);

    grid.innerHTML = '';
    if (filtered.length === 0) {
      grid.innerHTML = `<p>No products found.</p>`;
      return;
    }

    filtered.forEach(p => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <div class="product-info">
          <div>
            <h4>${p.name}</h4>
            <div class="price">$${p.price.toFixed(2)}</div>
          </div>
        </div>
        <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
      `;
      grid.appendChild(card);
    });

    // attach handlers
    grid.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => addToCart(btn.dataset.id));
    });
  }

  categoryFilter?.addEventListener('change', display);
  priceFilter?.addEventListener('change', display);
  searchBox?.addEventListener('input', display);

  display();
}
document.addEventListener('DOMContentLoaded', renderProducts);

// -------------------- RENDER CART (cart.html) --------------------
function renderCart() {
  const container = document.getElementById('cart-container');
  if (!container) return;
  const cart = getCart();
  container.innerHTML = '';

  if (cart.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  let total = 0;
  cart.forEach((entry) => {
    const prod = findProductById(entry.id);
    const qty = entry.qty;
    const subtotal = prod.price * qty;
    total += subtotal;

    const item = document.createElement('div');
    item.className = 'cart-item';
    item.innerHTML = `
      <img class="cart-thumb" src="${prod.image}" alt="${prod.name}">
      <div class="cart-info">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <strong>${prod.name}</strong>
          <button class="btn small remove-item" data-id="${prod.id}" title="Remove">✕</button>
        </div>
        <div class="cart-row">
          <div>Price: $${prod.price.toFixed(2)}</div>
          <div class="qty-controls">
            <button class="qty-btn" data-id="${prod.id}" data-delta="-1">−</button>
            <div style="min-width:30px; text-align:center;">${qty}</div>
            <button class="qty-btn" data-id="${prod.id}" data-delta="1">+</button>
          </div>
        </div>
      </div>
      <div class="subtotal">$${subtotal.toFixed(2)}</div>
    `;
    container.appendChild(item);
  });

  const totalDiv = document.createElement('div');
  totalDiv.className = 'cart-item';
  totalDiv.style.justifyContent = 'space-between';
  totalDiv.innerHTML = `
    <div style="font-weight:800">Total</div>
    <div style="font-weight:800">$${total.toFixed(2)}</div>
  `;
  container.appendChild(totalDiv);

  // attach qty handlers
  container.querySelectorAll('.qty-btn').forEach(b => {
    b.addEventListener('click', () => {
      const id = b.dataset.id;
      const delta = Number(b.dataset.delta);
      updateQuantity(id, delta);
    });
  });
  container.querySelectorAll('.remove-item').forEach(b => {
    b.addEventListener('click', () => removeItem(b.dataset.id));
  });
}

// wire clear and checkout buttons on cart page
document.addEventListener('DOMContentLoaded', () => {
  const clearBtn = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (!confirm('Clear entire cart?')) return;
      localStorage.removeItem('cart');
      renderCart();
    });
  }
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const cart = getCart();
      if (!cart || cart.length === 0) return alert('Cart is empty.');
      // Simple simulation of checkout
      const logged = localStorage.getItem('loggedInUser');
      if (!logged) {
        if (!confirm('You are not logged in. Log in now?')) return;
        window.location.href = 'login.html';
        return;
      }
      alert('Thank you for your purchase! (simulation)');
      localStorage.removeItem('cart');
      renderCart();
    });
  }
  // render cart if on cart page
  if (document.getElementById('cart-container')) renderCart();
});

// -------------------- LOGIN (login.html) --------------------
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;
  const loginMsg = document.getElementById('login-msg');

  // test account
  const testUser = { username: 'testuser', password: '12345' };

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value.trim();
    if (username === testUser.username && password === testUser.password) {
      localStorage.setItem('loggedInUser', username);
      loginMsg.textContent = 'Login successful! Redirecting...';
      loginMsg.style.color = 'green';
      updateNavUser();
      setTimeout(() => { window.location.href = 'index.html'; }, 700);
    } else {
      loginMsg.textContent = 'Invalid username or password.';
      loginMsg.style.color = 'crimson';
    }
  });
});

// -------------------- Ensure nav user updated on load --------------------
window.addEventListener('load', updateNavUser);

// -------------------- Expose some functions for inline use (optional) --------------------
// Not required but handy from console
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
