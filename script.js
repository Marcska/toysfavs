// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileNav = document.querySelector('.mobile-nav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
    });
}

// --- Dynamic Products & Cart Logic ---

// State
let cart = [];
const WHATSAPP_NUMBER = "525512345678"; // Replace with real number

// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalPriceEl = document.getElementById('cart-total-price');
const cartBadge = document.querySelector('.cart-btn .badge');
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});

// Render Products
function renderProducts() {
    if (!productsContainer) return;

    productsContainer.innerHTML = products.map(product => `
        <article class="product-card">
            ${product.badge ? `<div class="product-badge ${product.badgeClass}">${product.badge}</div>` : ''}
            <div class="product-img-placeholder" data-label="${product.name}">
                <i class="${product.icon}"></i>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="rating">
                    ${getStarRating(product.rating)}
                </div>
                <p class="price">$${product.price.toFixed(2)} ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}</p>
                <button class="btn btn-secondary" onclick="addToCart(${product.id})">Agregar al carrito</button>
            </div>
        </article>
    `).join('');
}

// Helper: Generate Star Rating HTML
function getStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>'; // Empty star if needed, or just omit
        }
    }
    return stars;
}

// Add to Cart
window.addToCart = function (productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    openCart();
};

// Remove from Cart
window.removeFromCart = function (productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
};

// Update Cart Quantity
window.updateQuantity = function (productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartUI();
        }
    }
};

// Update Cart UI
function updateCartUI() {
    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartBadge) cartBadge.innerText = totalItems;

    // Update Modal Content
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Tu carrito está vacío. ¡Agrega algo de alegría!</div>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)} x ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                        <button onclick="removeFromCart(${item.id})" class="remove-btn"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `).join('');
        }
    }

    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotalPriceEl) cartTotalPriceEl.innerText = `$${total.toFixed(2)}`;
}

// Cart Modal Toggle
if (cartBtn) {
    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });
}

if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });
}

function openCart() {
    if (cartModal) cartModal.classList.add('active');
}

// Checkout (WhatsApp)
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return;

        let message = "Hola Toys Favs, quiero comprar los siguientes juguetes:\n\n";
        cart.forEach(item => {
            message += `- ${item.quantity}x ${item.name} ($${item.price})\n`;
        });

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        message += `\nTotal: $${total.toFixed(2)}\n\nEntrega en Plaza Parque Jardín.`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
    });
}


// Countdown Timer (Existing)
function updateCountdown() {
    const christmasDate = new Date(new Date().getFullYear(), 11, 25); // Month is 0-indexed, so 11 is Dec
    const now = new Date();

    // If Christmas has passed this year, set for next year
    if (now > christmasDate) {
        christmasDate.setFullYear(christmasDate.getFullYear() + 1);
    }

    const diff = christmasDate - now;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const elDays = document.getElementById('days');
    if (elDays) {
        elDays.innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    }
}

setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call
