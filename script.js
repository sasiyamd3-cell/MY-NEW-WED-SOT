/* ===== CONFIG ===== */
const WHATSAPP_NUMBER = "94726442818";
const ADMIN_EMAIL = "admin@besthand.lk";
const ADMIN_PASSWORD = "besthand2025";
const STORAGE_KEY = "besthand_products";

/* ===== DEFAULT PRODUCTS ===== */
const DEFAULT_PRODUCTS = [
  {
    id: "1",
    name: "Nike Air Jordan 1",
    price: 12500,
    oldPrice: 15000,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800",
    description: "Premium Nike Air Jordan 1 sneakers",
    stock: 10,
    isBestSeller: true,
    rating: 4.8,
    reviews: 120
  },
  {
    id: "2",
    name: "Nike Hoodie",
    price: 6500,
    oldPrice: 8500,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
    description: "Comfortable Nike hoodie",
    stock: 15,
    isBestSeller: true,
    rating: 4.7,
    reviews: 85
  },
  {
    id: "3",
    name: "Nike Backpack",
    price: 4800,
    oldPrice: 6500,
    category: "Bags",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
    description: "Durable Nike backpack",
    stock: 8,
    isBestSeller: true,
    rating: 4.6,
    reviews: 72
  },
  {
    id: "4",
    name: "JBL Speaker",
    price: 9900,
    oldPrice: 12500,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800",
    description: "Portable JBL Bluetooth speaker",
    stock: 5,
    isBestSeller: true,
    rating: 4.9,
    reviews: 64
  },
  {
    id: "5",
    name: "AirPods Pro",
    price: 18500,
    oldPrice: 22000,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800",
    description: "Apple AirPods Pro with noise cancellation",
    stock: 12,
    isBestSeller: true,
    rating: 4.8,
    reviews: 95
  },
  {
    id: "6",
    name: "Adidas Sneakers",
    price: 9500,
    oldPrice: 12000,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800",
    description: "Stylish Adidas sneakers",
    stock: 20,
    isBestSeller: false,
    rating: 4.5,
    reviews: 45
  },
  {
    id: "7",
    name: "Leather Handbag",
    price: 7500,
    oldPrice: 9500,
    category: "Bags",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
    description: "Elegant leather handbag",
    stock: 6,
    isBestSeller: false,
    rating: 4.7,
    reviews: 32
  },
  {
    id: "8",
    name: "Smart Watch",
    price: 15500,
    oldPrice: 19000,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
    description: "Advanced smart watch",
    stock: 0,
    isBestSeller: false,
    rating: 4.6,
    reviews: 28
  }
];

/* ===== STATE ===== */
let products = [];
let currentCategory = "All";
let searchQuery = "";

/* ===== LOAD / SAVE ===== */
function loadProducts() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      products = JSON.parse(stored);
    } catch {
      products = [...DEFAULT_PRODUCTS];
    }
  } else {
    products = [...DEFAULT_PRODUCTS];
  }
  saveProducts();
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

/* ===== RENDER CATEGORIES ===== */
function renderCategories() {
  const cats = [
    { name: "All", icon: "🏠" },
    { name: "Shoes", icon: "👟" },
    { name: "Clothing", icon: "👕" },
    { name: "Bags", icon: "🎒" },
    { name: "Accessories", icon: "🎧" },
    { name: "Electronics", icon: "📱" }
  ];

  const grid = document.getElementById("categoryGrid");
  grid.innerHTML = cats.map(c => `
    <div class="cat-card ${currentCategory === c.name ? 'active' : ''}" onclick="filterCategory('${c.name}')">
      <span class="icon">${c.icon}</span>
      <span>${c.name}</span>
    </div>
  `).join("");
}

/* ===== RENDER PRODUCTS ===== */
function renderProducts() {
  let filtered = products;

  if (currentCategory !== "All") {
    filtered = filtered.filter(p => p.category === currentCategory);
  }

  if (searchQuery) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const grid = document.getElementById("productGrid");
  const noProducts = document.getElementById("noProducts");

  if (filtered.length === 0) {
    grid.innerHTML = "";
    noProducts.style.display = "block";
    return;
  }

  noProducts.style.display = "none";

  grid.innerHTML = filtered.map(p => {
    const outOfStock = p.stock <= 0;
    const lowStock = p.stock > 0 && p.stock <= 5;

    return `
      <div class="product-card">
        <div class="product-image">
          <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400x300/14141f/8b5cf6?text=No+Image'" />
          ${p.isBestSeller ? '<span class="badge-best">🔥 Best Seller</span>' : ''}
          ${outOfStock ? '<div class="badge-out"><span>OUT OF STOCK</span></div>' : ''}
        </div>
        <div class="product-info">
          <h3>${p.name}</h3>
          <p class="product-cat">${p.category}</p>
          <div class="product-price">
            <span class="price-current">Rs ${p.price.toLocaleString()}</span>
            ${p.oldPrice > 0 ? `<span class="price-old">Rs ${p.oldPrice.toLocaleString()}</span>` : ''}
          </div>
          <div class="product-rating">⭐ ${p.rating} (${p.reviews} reviews)</div>
          <div class="product-stock ${outOfStock ? 'stock-out' : 'stock-in'}">
            ${outOfStock ? '❌ Out of Stock' : `✅ In Stock: ${p.stock} items`}
            ${lowStock ? ' ⚠️ Only few left!' : ''}
          </div>
          <button class="btn-cart" ${outOfStock ? 'disabled' : ''} onclick="orderNow('${p.id}')">
            ${outOfStock ? 'Out of Stock' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>
    `;
  }).join("");
}

/* ===== FILTER ===== */
function filterCategory(cat) {
  currentCategory = cat;
  renderCategories();
  renderProducts();
  document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
}

/* ===== SEARCH ===== */
document.getElementById("searchInput").addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderProducts();
});

/* ===== WHATSAPP ORDER ===== */
function orderNow(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const message = 
    `*🛒 NEW ORDER - BEST HAND*%0A%0A` +
    `*Product:* ${product.name}%0A` +
    `*Price:* Rs. ${product.price.toLocaleString()}%0A` +
    `*Category:* ${product.category}%0A` +
    `*Quantity:* 1%0A%0A` +
    `Please confirm my order. Thank you! 🙏`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
}

/* ===== ADMIN LOGIN ===== */
function openAdmin() {
  if (localStorage.getItem("besthand_admin") === "true") {
    document.getElementById("adminModal").classList.add("active");
    renderAdminList();
    updateStats();
  } else {
    document.getElementById("loginModal").classList.add("active");
  }
}

function closeLogin() {
  document.getElementById("loginModal").classList.remove("active");
  document.getElementById("loginError").style.display = "none";
}

function closeAdmin() {
  document.getElementById("adminModal").classList.remove("active");
}

function adminLogin() {
  const email = document.getElementById("adminEmail").value;
  const pass = document.getElementById("adminPass").value;

  if (email === ADMIN_EMAIL && pass === ADMIN_PASSWORD) {
    localStorage.setItem("besthand_admin", "true");
    closeLogin();
    document.getElementById("adminModal").classList.add("active");
    renderAdminList();
    updateStats();
    document.getElementById("adminEmail").value = "";
    document.getElementById("adminPass").value = "";
  } else {
    document.getElementById("loginError").style.display = "block";
  }
}

function logout() {
  localStorage.removeItem("besthand_admin");
  closeAdmin();
}

/* ===== ADMIN: ADD FORM ===== */
function toggleAddForm() {
  const form = document.getElementById("addForm");
  form.style.display = form.style.display === "none" ? "block" : "none";
}

function saveProduct() {
  const name = document.getElementById("pName").value.trim();
  const price = Number(document.getElementById("pPrice").value);
  const oldPrice = Number(document.getElementById("pOldPrice").value) || 0;
  const category = document.getElementById("pCategory").value;
  const image = document.getElementById("pImage").value.trim();
  const stock = Number(document.getElementById("pStock").value);
  const description = document.getElementById("pDescription").value.trim();
  const isBestSeller = document.getElementById("pBestSeller").checked;

  if (!name || !price || !image || stock === "") {
    alert("⚠️ Please fill all required fields!");
    return;
  }

  const newProduct = {
    id: Date.now().toString(),
    name,
    price,
    oldPrice,
    category,
    image,
    description,
    stock,
    isBestSeller,
    rating: 4.5,
    reviews: 0
  };

  products.unshift(newProduct);
  saveProducts();
  renderProducts();
  renderAdminList();
  updateStats();

  // Reset form
  document.getElementById("pName").value = "";
  document.getElementById("pPrice").value = "";
  document.getElementById("pOldPrice").value = "";
  document.getElementById("pImage").value = "";
  document.getElementById("pStock").value = "";
  document.getElementById("pDescription").value = "";
  document.getElementById("pBestSeller").checked = false;
  document.getElementById("addForm").style.display = "none";

  alert("✅ Product added successfully!");
}

/* ===== ADMIN: RENDER LIST ===== */
function renderAdminList() {
  const list = document.getElementById("adminList");
  if (products.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:#9ca3af;padding:20px;">No products yet</p>';
    return;
  }

  list.innerHTML = products.map(p => `
    <div class="admin-item">
      <img src="${p.image}" onerror="this.src='https://via.placeholder.com/50/14141f/8b5cf6?text=?'" />
      <div class="admin-item-info">
        <h4>${p.name}</h4>
        <p>Rs ${p.price.toLocaleString()} • ${p.category}</p>
      </div>
      <input 
        type="number" 
        class="stock-input" 
        value="${p.stock}" 
        onchange="updateStock('${p.id}', this.value)"
        title="Stock"
      />
      <button class="btn-delete" onclick="deleteProduct('${p.id}')">🗑️</button>
    </div>
  `).join("");
}

/* ===== ADMIN: UPDATE STOCK ===== */
function updateStock(id, newStock) {
  const product = products.find(p => p.id === id);
  if (!product) return;
  product.stock = Number(newStock);
  saveProducts();
  renderProducts();
  updateStats();
}

/* ===== ADMIN: DELETE ===== */
function deleteProduct(id) {
  if (!confirm("මේ බඩුව delete කරන්නද? 🗑️")) return;
  products = products.filter(p => p.id !== id);
  saveProducts();
  renderProducts();
  renderAdminList();
  updateStats();
}

/* ===== ADMIN: STATS ===== */
function updateStats() {
  document.getElementById("statTotal").textContent = products.length;
  document.getElementById("statStock").textContent = products.reduce((s, p) => s + p.stock, 0);
  document.getElementById("statOut").textContent = products.filter(p => p.stock <= 0).length;
}

/* ===== EXPORT JSON ===== */
function exportJSON() {
  const dataStr = JSON.stringify(products, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "products.json";
  a.click();
  URL.revokeObjectURL(url);
}

/* ===== CLOSE MODAL ON OUTSIDE CLICK ===== */
document.querySelectorAll(".modal").forEach(modal => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });
});

/* ===== INIT ===== */
loadProducts();
renderCategories();
renderProducts();
