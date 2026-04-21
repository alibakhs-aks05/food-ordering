var swiper = new Swiper(".mySwiper", {
  loop: true,
  navigation: {
    nextEl: "#next",
    prevEl: "#prev",
  },
});

const cartIcon = document.querySelector('.cart-icon');
const cartTab = document.querySelector('.cart-tab');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');
const cartTotal = document.querySelector('.cart-total');
const cartValue = document.querySelector('.cart-value');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const bars = document.querySelector('.fa-bars');


cartIcon.addEventListener("click", () =>
  cartTab.classList.add("cart-tab-active")
);
closeBtn.addEventListener("click", () =>
  cartTab.classList.remove("cart-tab-active")
);
hamburger.addEventListener('click', ()=> mobileMenu.classList.toggle('mobile-menu-active'));
hamburger.addEventListener('click', ()=> bars.classList.toggle('fa-xmark'));

let productList = [];
let cartProduct = [];
let cart = [];


const updateTotals = () => {

  let totalPrice = 0;
  let totalQuantity = 0;

  document.querySelectorAll('.item').forEach(item => {

    const quantity = parseInt(item.querySelector('.quantity-value').textContent);
    const price = parseFloat(item.querySelector('.item-total').textContent.replace('$', ''));

    totalPrice += price;
    totalQuantity += quantity;
  });

  cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
  cartValue.textContent = totalQuantity;

}

const showCard = () => {
  productList.forEach((product) => {
    const orderCard = document.createElement("div");
    orderCard.classList.add("order-card");

    orderCard.innerHTML = `
        <div class="card-image">
                            <img src="${product.image}">
                        </div>
                        <h4>${product.name}</h4>
                        <h4 class="price">${product.price}</h4>
                    <a href="#" class="btn card-btn">Add  to cart</a>
        `;

    cardList.appendChild(orderCard);

    const cardBtn = orderCard.querySelector(".card-btn");

    cardBtn.addEventListener("click", (e) => {
      e.preventDefault();
      addToCart(product);
    });
  });
};

const addToCart = (product) => {

  const existingProduct = cartProduct.find(item => item.id === product.id);
  if (existingProduct) {

    alert('Item already in your cart');
    return;

  };

  cartProduct.push(product);

  let quantity = 1;
  let price = parseFloat(product.price.replace('$', ''));

  const cartItem = document.createElement("div");
  cartItem.classList.add("item");
  cartItem.innerHTML = `
    <div class="item-image">
                                <img src="${product.image}">
                            </div>
                            <div class="detail">
                                <h4>${product.name}</h4>
                                <h4 class="item-total">${product.price}</h4>
                            </div>
                            <div class="flex">
                                <a href="#" class="quantity-btn minus">
                                    <i class="fa-solid fa-minus"></i>
                                </a>
                                <h4 class="quantity-value">${quantity}</h4>
                                <a href="#" class="quantity-btn plus">
                                    <i class="fa-solid fa-plus"></i>
                                </a>
                            </div>
    `;

  cartList.appendChild(cartItem);
  updateTotals();

  const plusBtn = cartItem.querySelector('.plus');
  const quantityValue = cartItem.querySelector('.quantity-value');
  const itemTotal = cartItem.querySelector('.item-total');
  const minusBtn = cartItem.querySelector('.minus')

  plusBtn.addEventListener('click', (e) => {
    e.preventDefault();

    quantity++;
    quantityValue.textContent = quantity;
    itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
    updateTotals();

  });

  minusBtn.addEventListener('click', (e) => {
    e.preventDefault();

    if (quantity > 1) {
      quantity--;
      quantityValue.textContent = quantity;
      itemTotal.textContent = `$${(price * quantity).toFixed(2)}`;
      updateTotals();

    }
    else {
      cartItem.classList.add('slide-out')
      setTimeout(() => {
        cartItem.remove();
        cartProduct = cartProduct.filter(item => item.id !== product.id);
        updateTotals();

      }, 300)
    }

  })

};
 


// ===== Robust Sign-In Modal Handler =====
document.addEventListener('DOMContentLoaded', () => {
  // Find modal and close button
  const signinModal = document.getElementById('signin-modal');
  const signinCloseBtn = document.querySelector('.signin-close-btn');

  if (!signinModal) {
    console.error('Sign-in modal not found: element with id="signin-modal" is missing in the HTML.');
    return;
  }
  if (!signinCloseBtn) {
    console.error('Sign-in modal close button not found: element with class="signin-close-btn" is missing in the HTML.');
    // continue — we can still open modal but closing by × won't work until fixed
  }

  // Try several ways to find the Sign-in button (most tolerant)
  let signInBtn =
    document.querySelector('a[href="signin.html"]') ||               // exact anchor with href
    document.querySelector('a.btn[href="signin.html"]') ||          // explicit anchor.btn
    Array.from(document.querySelectorAll('.btn')).find(b => /sign\s*in/i.test(b.textContent)) || // any .btn with text "Sign in"
    document.querySelector('button.signin') ||                      // fallback: a button with class signin
    null;

  if (!signInBtn) {
    console.error('Sign-in button not found. Expected an <a href="signin.html" class="btn"> or a .btn containing text "Sign in".');
    // As a last resort, attach a delegated listener and detect clicks
    document.addEventListener('click', function delegatedSignIn(e) {
      const a = e.target.closest && e.target.closest('a, button');
      if (a && /sign\s*in/i.test(a.textContent || '')) {
        e.preventDefault();
        signinModal.style.display = 'flex';
        // keep the delegated listener in case button removed/replaced
      }
    });
    console.warn('Delegate listener installed: clicking any element whose text contains "Sign in" will open the popup.');
    return;
  }

  // Open modal when clicking Sign In button
  signInBtn.addEventListener('click', (e) => {
    // If anchor, prevent navigation
    if (signInBtn.tagName.toLowerCase() === 'a') e.preventDefault();
    signinModal.style.display = 'flex';
    // optional: lock page scroll
    document.documentElement.style.overflow = 'hidden';
  });

  // Close modal when clicking the × button (if it exists)
  if (signinCloseBtn) {
    signinCloseBtn.addEventListener('click', () => {
      signinModal.style.display = 'none';
      document.documentElement.style.overflow = '';
    });
  }

  // Close modal when clicking outside the modal content
  window.addEventListener('click', (e) => {
    if (e.target === signinModal) {
      signinModal.style.display = 'none';
      document.documentElement.style.overflow = '';
    }
  });

  console.log('Sign-in modal script initialized. Found signInBtn:', signInBtn, 'signinModal:', signinModal);
});


// ===== Checkout Confirmation and Cart Clear =====
document.addEventListener('DOMContentLoaded', () => {
  const checkoutBtn = document.querySelector('#checkout-btn') || document.querySelector('.checkout');

  if (!checkoutBtn) {
    console.error('Checkout button not found in HTML.');
    return;
  }

  checkoutBtn.addEventListener('click', (e) => {
    e.preventDefault();

    // Show confirmation message
    alert('✅ Your order has been placed!\nIt will be delivered very soon.\nHappy eating! ');

    // ===== Clear cart =====

    // If you use localStorage to save the cart:
    localStorage.removeItem('cartItems');

    // If you use a cart array in JS:
    if (typeof cart !== 'undefined' && Array.isArray(cart)) {
      cart.length = 0; // empty the array
    }

    // If you have a cart display container, clear its HTML
    const cartContainer = document.querySelector('.cart-items') || document.getElementById('cart-items');
    if (cartContainer) {
      cartContainer.innerHTML = '<p>Your cart is empty 🛒</p>';
    }

    // If you show total price, reset it
    const totalEl = document.querySelector('.total-price') || document.getElementById('total-price');
    if (totalEl) {
      totalEl.textContent = '₹0';
    }
  });
});



const initApp = () => {
  fetch("products.json")
    .then((response) => response.json())
    .then((data) => {
      productList = data;
      showCard();
    });
};

initApp();
