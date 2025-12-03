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
const cartBadge = document.querySelector('.cart-count');
const cartBtn = document.querySelector('.cart-icon');
const closeCartBtn = document.getElementById('close-cart');
const checkoutBtn = document.getElementById('checkout-btn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products); // Render all products initially
    updateCartUI();
    setupCategoryFilters();
});

// Helper: Create Product Card HTML
function createProductCardHTML(product) {
    // Determine icon based on category or random
    let iconClass = 'fas fa-gift';
    if (product.category === 'bebes' || product.category === 'Bebés') iconClass = 'fas fa-baby';
    if (product.category === '3-5' || product.category === '3-5 años') iconClass = 'fas fa-child';
    if (product.category === '6-9' || product.category === '6-9 años') iconClass = 'fas fa-gamepad';
    if (product.category === '10-12' || product.category === '10-12 años') iconClass = 'fas fa-headset';
    if (product.category === 'coleccionables') iconClass = 'fas fa-trophy';
    if (product.category === 'juegos') iconClass = 'fas fa-dice';
    if (product.category === 'educativos') iconClass = 'fas fa-book';

    if (product.badge === 'Más vendido') iconClass = 'fas fa-fire';
    if (product.badge === 'Nuevo') iconClass = 'fas fa-star';

    return `
        <div class="product-card">
            <div class="product-icon-top"><i class="${iconClass}"></i></div>
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <span class="product-category">${product.badge || 'OFERTA'}</span>
                <h3>${product.name}</h3>
                <div class="product-rating">
                    ${getStars(product.rating)} <span>(${Math.floor(Math.random() * 200) + 50})</span>
                </div>
                <p class="product-description">${product.description || ''}</p>
                <div class="product-price">
                    <span class="current-price">$${product.price.toFixed(2)}</span>
                    ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Agregar al carrito
                </button>
            </div>
        </div>
    `;
}

// Render Products
function renderProducts(productsToRender) {
    if (!productsContainer) return;

    productsContainer.innerHTML = ''; // Clear existing products

    if (productsToRender.length === 0) {
        productsContainer.innerHTML = '<p style="text-align: center; width: 100%; grid-column: 1/-1; padding: 40px;">No se encontraron productos.</p>';
        return;
    }

    productsToRender.forEach(product => {
        productsContainer.innerHTML += createProductCardHTML(product);
    });
}

function getStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (i < Math.floor(rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === Math.floor(rating) && rating % 1 !== 0) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
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

// Close Modal on Outside Click
window.onclick = function (event) {
    if (event.target == cartModal) {
        cartModal.style.display = "none";
    }
};

// Search Functionality
const searchInput = document.querySelector('.search-bar input');
const searchBtn = document.querySelector('.search-bar button');

function performSearch() {
    const query = searchInput.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );

    renderProducts(filteredProducts);

    // Scroll to products
    const productsSection = document.getElementById('products-container');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

if (searchBtn) {
    searchBtn.addEventListener('click', performSearch);
}

if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Category Filtering
function setupCategoryFilters() {
    const navLinks = document.querySelectorAll('.secondary-nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all
            navLinks.forEach(l => l.classList.remove('nav-highlight'));
            // Add to current
            link.classList.add('nav-highlight');

            const href = link.getAttribute('href');
            let category = href.replace('#', '');

            // Map href to product category values
            // hrefs: bebes, 3-5, 6-9, 10-12, juegos, educativos, ofertas
            // product categories: bebes, 3-5, 6-9, coleccionables, juegos, educativos, varios

            let filteredProducts = products;

            if (category === 'ofertas') {
                // Show all or specific logic for offers? Let's show all for now or filter by badge
                // filteredProducts = products.filter(p => p.badge === 'Oferta' || p.badge === 'Más vendido');
                // User probably expects to see everything or specific offers. Let's show all for "Ofertas navideñas" as a "Home" equivalent
                filteredProducts = products;
            } else {
                filteredProducts = products.filter(product => {
                    // Normalize for comparison
                    const pCat = product.category.toLowerCase();

                    if (category === '3-5') return pCat === '3-5' || pCat === '3-5 años';
                    if (category === '6-9') return pCat === '6-9' || pCat === '6-9 años';
                    if (category === '10-12') return pCat === '10-12' || pCat === '10-12 años' || pCat === 'coleccionables';

                    return pCat === category;
                });
            }

            renderProducts(filteredProducts);

            // Scroll to products
            const productsSection = document.getElementById('products-container');
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// View Catalog Button Logic
const viewCatalogBtn = document.getElementById('view-catalog-btn');
if (viewCatalogBtn) {
    viewCatalogBtn.addEventListener('click', (e) => {
        e.preventDefault();

        // Reset filters
        const navLinks = document.querySelectorAll('.secondary-nav a');
        navLinks.forEach(l => l.classList.remove('nav-highlight'));

        // Render all products
        renderProducts(products);

        // Scroll to products
        const productsSection = document.getElementById('products-container');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
}

