// Cart functionality
class Cart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
    this.products = {
      1: { name: "Giày bóng đá Adidas", price: 2000000, image: "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg" },
      2: { name: "Bóng rổ Spalding", price: 1200000, image: "https://images.pexels.com/photos/1831205/pexels-photo-1831205.jpeg" },
      3: { name: "Vợt tennis Wilson", price: 3500000, image: "https://images.unsplash.com/photo-1516043827470-d52af543356a" }
    };
  }

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
    this.updateCartCount();
    this.updateCartPage();
  }

  add(productId, quantity = 1) {
    const existingItem = this.items.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ id: productId, quantity });
    }
    this.save();
  }

  remove(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.save();
  }

  updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
      this.remove(productId);
      return;
    }
    
    const item = this.items.find(item => item.id === productId);
    if (item) {
      item.quantity = newQuantity;
      this.save();
    }
  }

  clear() {
    this.items = [];
    this.save();
  }

  updateCartCount() {
    const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
    });
  }

  updateCartPage() {
    if (window.location.pathname.includes('cart.html')) {
      window.dispatchEvent(new Event('cartUpdated'));
    }
    // Force cart count update on all pages
    this.updateCartCount();
  }

  getProductInfo(productId) {
    return this.products[productId] || { name: `Sản phẩm ${productId}`, price: 100000, image: "https://via.placeholder.com/80" };
  }

  getTotal() {
    return this.items.reduce((sum, item) => {
      const product = this.getProductInfo(item.id);
      return sum + (item.quantity * product.price);
    }, 0);
  }
}

// Initialize cart
const cart = new Cart();

// Update cart count on page load
document.addEventListener('DOMContentLoaded', () => {
  cart.updateCartCount();
});

// Listen for cart updates
window.addEventListener('cartUpdated', () => {
  cart.updateCartCount();
});
