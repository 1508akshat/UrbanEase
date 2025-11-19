// Simple cart management using localStorage
(function () {
  const STORAGE_KEY = 'urbanease_cart';

  function getCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to read cart from storage', e);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
  }

  function addToCart(item) {
    const cart = getCart();
    const existing = cart.find((p) => p.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    saveCart(cart);
    showToast('Added to cart');
    renderCartBadge();
  }

  function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter((p) => p.id !== id);
    saveCart(cart);
    renderCartBadge();
  }

  function getCartCount() {
    return getCart().reduce((sum, item) => sum + (item.quantity || 1), 0);
  }

  function formatCurrency(amount) {
    if (isNaN(amount)) return '';
    return '₹' + amount.toLocaleString('en-IN');
  }

  function renderCartBadge() {
    const badge = document.querySelector('[data-cart-count]');
    if (!badge) return;
    const count = getCartCount();
    badge.textContent = count > 0 ? String(count) : '0';
    badge.style.display = count > 0 ? 'inline-flex' : 'none';
  }

  function showToast(message) {
    let toast = document.querySelector('.cart-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'cart-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  function renderCartPage() {
    const listEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const emptyEl = document.getElementById('cart-empty');
    if (!listEl || !totalEl || !emptyEl) return;

    const cart = getCart();
    listEl.innerHTML = '';

    if (!cart.length) {
      emptyEl.style.display = 'block';
      totalEl.textContent = '₹0';
      return;
    }

    emptyEl.style.display = 'none';
    let total = 0;

    cart.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'cart-item';
      const qty = item.quantity || 1;
      const lineTotal = (item.price || 0) * qty;
      total += lineTotal;

      li.innerHTML = `
        <div class="cart-item-main">
          <div>
            <h3>${item.name}</h3>
            <p class="cart-item-meta">${item.category || ''}</p>
            <p class="cart-item-price">${formatCurrency(item.price || 0)} × ${qty}</p>
          </div>
        </div>
        <button class="btn btn-secondary cart-remove" type="button" data-id="${item.id}">Remove</button>
      `;
      listEl.appendChild(li);
    });

    totalEl.textContent = formatCurrency(total);

    // Attach remove handlers
    listEl.querySelectorAll('.cart-remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        removeFromCart(id);
        renderCartPage();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Add-to-cart buttons under products
    document.querySelectorAll('.btn-add-to-cart').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        const price = parseInt(btn.getAttribute('data-price') || '0', 10);
        const category = btn.getAttribute('data-category') || '';
        if (!id || !name) return;
        addToCart({ id, name, price, category });
      });
    });

    renderCartBadge();
    renderCartPage();
  });
})();


