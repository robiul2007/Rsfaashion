// Product Database
const products = [
    { id: 1, sku: 'Rs01K', name: 'Premium Chiffon Hijab', price: 1299, img: 'prod1.jpg' },
    { id: 2, sku: 'Rs02K', name: 'Elegant Black Abaya', price: 1299, img: 'prod2.jpg' },
    { id: 3, sku: 'Rs03K', name: 'Everyday Cotton Hijab', price: 1499, img: 'prod3.jpg' },
    { id: 4, sku: 'Rs04K', name: 'Premium Jersey Hijab', price: 1299, img: 'prod4.jpg' },
    { id: 8, sku: 'Rs01J', name: 'new Chiffon Hijab', price: 1299, img: 'prod2.jpg' }, 
    { id: 5, sku: 'Rs05K', name: 'Elegant Black Abaya', price: 1399, img: 'cat4.jpg' },
    { id: 6, sku: 'Rs06K', name: 'Cotton Hijab', price: 180, img: 'prod5.jpg' },
    { id: 7, sku: 'Rs07K', name: 'Jersey Hijab', price: 1299, img: 'cat3.jpg' }
];

let cart = [];
let currentProduct = null;
let currentUser = null;
let checkoutMode = 'single'; 
let orderMethod = 'whatsapp'; 
let currentOrderTotal = 0; 

const sellerWhatsAppNumber = '919876543210'; 
const instagramUsername = 'rs__fashion____009'; 
const myUpiId = 'skri250@ybl'; 

// Initialization (More Secure Load)
document.addEventListener("DOMContentLoaded", () => {
    restoreSession(); // Load saved User & Cart data FIRST
    renderProducts();
    startAutoSlide();
});

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
}

// Dark Mode Toggle Logic
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const themeIcon = document.getElementById('theme-toggle');
    
    if (document.body.classList.contains('dark-mode')) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Share Product Logic
function shareProduct() {
    if(!currentProduct) return;
    const shareText = `Hey! Check out this beautiful ${currentProduct.name} at RS Fashion. Only ₹${currentProduct.price}!\n\nBrowse the collection here: https://rsfashion01.netlify.app`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
}

// Image Slider Logic
let slideIndex = 0;
let slideInterval;
function showSlide(index) {
    const wrapper = document.getElementById('sliderWrapper');
    if (index > 3) slideIndex = 0; 
    else if (index < 0) slideIndex = 3; 
    else slideIndex = index;
    wrapper.style.transform = `translateX(-${slideIndex * 100}%)`;
}
function nextSlide() { showSlide(slideIndex + 1); resetSlideTimer(); }
function prevSlide() { showSlide(slideIndex - 1); resetSlideTimer(); }
function startAutoSlide() { slideInterval = setInterval(() => { nextSlide(); }, 3500); }
function resetSlideTimer() { clearInterval(slideInterval); startAutoSlide(); }

function navigate(viewId) {
    document.querySelectorAll('.view-section').forEach(view => view.classList.remove('active-view'));
    document.getElementById(viewId).classList.add('active-view');
    window.scrollTo(0, 0);
    if(viewId === 'cart-view') renderCart();
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    products.forEach(p => {
        grid.innerHTML += `
            <div class="product-card" onclick="openProduct(${p.id})">
                <div class="product-img-wrap"><img src="${p.img}" alt="${p.name}"></div>
                <div class="product-info">
                    <h3 class="p-title">${p.name}</h3>
                    <p class="p-price">₹${p.price}</p>
                </div>
            </div>
        `;
    });
}

function openSidebar() {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebar-overlay').style.display = 'block';
}
function closeSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').style.display = 'none';
}
function toggleSearch() {
    const searchBox = document.getElementById('search-container');
    searchBox.style.display = searchBox.style.display === 'block' ? 'none' : 'block';
    document.getElementById('search-input').focus();
}

function filterProducts() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const suggestionsBox = document.getElementById('search-suggestions');
    if(query.length === 0) { suggestionsBox.style.display = 'none'; return; }
    const filtered = products.filter(p => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query));
    suggestionsBox.innerHTML = '';
    if(filtered.length > 0) {
        filtered.forEach(p => {
            suggestionsBox.innerHTML += `
                <div class="suggestion-item" onclick="openProduct(${p.id}); document.getElementById('search-container').style.display='none';">
                    <img src="${p.img}" style="width: 50px; height: 50px; border-radius: 5px; object-fit: cover;">
                    <div><div style="font-weight: 500;">${p.name}</div><div style="color: var(--accent-color); font-size: 12px;">ID: ${p.sku} | ₹${p.price}</div></div>
                </div>
            `;
        });
        suggestionsBox.style.display = 'block';
    } else {
        suggestionsBox.innerHTML = '<div class="suggestion-item">No products found</div>';
        suggestionsBox.style.display = 'block';
    }
}

function openProduct(id) {
    currentProduct = products.find(p => p.id === id);
    document.getElementById('pd-img').src = currentProduct.img;
    document.getElementById('pd-img-thumb1').src = currentProduct.img;
    document.getElementById('pd-img-thumb2').src = 'prod1.jpg'; 
    document.getElementById('pd-img-thumb3').src = 'prod3.jpg'; 
    document.getElementById('pd-id').innerText = `Product ID: ${currentProduct.sku}`;
    document.getElementById('pd-title').innerText = currentProduct.name;
    document.getElementById('pd-price').innerText = `₹${currentProduct.price}`;
    navigate('product-view');
}

function changeMainImg(src) { document.getElementById('pd-img').src = src; }

/* CART LOGIC WITH LOCALSTORAGE */
function addToCartFromDetail() {
    cart.push(currentProduct);
    saveCart(); 
    document.getElementById('cart-counter').innerText = cart.length;
    showToast(`${currentProduct.name} added to cart!`);
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    container.innerHTML = '';
    let total = 0;
    if(cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding: 20px;">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            container.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 5px;">
                    <div style="flex-grow: 1;"><p style="font-size: 11px; color: var(--text-gray);">ID: ${item.sku}</p><h4>${item.name}</h4><p style="color: var(--accent-color); font-weight: bold;">₹${item.price}</p></div>
                    <i class="fas fa-trash" style="color: red; cursor: pointer; padding: 10px;" onclick="removeFromCart(${index})"></i>
                </div>
            `;
        });
    }
    document.getElementById('cart-total').innerText = `Total: ₹${total}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart(); 
    document.getElementById('cart-counter').innerText = cart.length;
    renderCart();
}

function saveCart() {
    localStorage.setItem('rsFashionCart', JSON.stringify(cart));
}

/* USER LOGIC WITH LOCALSTORAGE */
function handleUserClick() {
    if(currentUser) navigate('profile-view');
    else openLogin();
}

function openLogin() { document.getElementById('login-modal').style.display = 'flex'; }
function closeLogin() { document.getElementById('login-modal').style.display = 'none'; }

function processLogin() {
    const name = document.getElementById('login-name').value;
    const phone = document.getElementById('login-number').value;
    if(name && phone) {
        const uniqueId = `Rs${Math.floor(1000 + Math.random() * 9000)}R`;
        currentUser = { name, phone, id: uniqueId };
        
        localStorage.setItem('rsFashionUser', JSON.stringify(currentUser));
        
        updateProfileUI();
        closeLogin();
        navigate('profile-view');
        showToast("Successfully logged in!");
    } else { showToast("Please enter both Name and Number."); }
}

function logoutUser() {
    currentUser = null;
    localStorage.removeItem('rsFashionUser');
    
    updateProfileUI();
    document.getElementById('login-name').value = '';
    document.getElementById('login-number').value = '';
    navigate('home-view');
    showToast("Logged out successfully.");
}

function updateProfileUI() {
    if(currentUser) {
        document.getElementById('sidebar-user-display').innerHTML = `Logged in as: <b>${currentUser.name}</b><br>ID: <span style="color: var(--accent-color)">${currentUser.id}</span>`;
        document.getElementById('prof-name').innerText = currentUser.name;
        document.getElementById('prof-phone').innerText = currentUser.phone;
        document.getElementById('prof-id').innerText = currentUser.id;
    } else {
        document.getElementById('sidebar-user-display').innerText = "Not Logged In";
        document.getElementById('prof-name').innerText = "Name";
        document.getElementById('prof-phone').innerText = "...";
        document.getElementById('prof-id').innerText = "...";
    }
}

// RESTORE SESSION ON PAGE LOAD
function restoreSession() {
    const savedUser = localStorage.getItem('rsFashionUser');
    if(savedUser) {
        currentUser = JSON.parse(savedUser);
        updateProfileUI();
    }
    const savedCart = localStorage.getItem('rsFashionCart');
    if(savedCart) {
        cart = JSON.parse(savedCart);
        document.getElementById('cart-counter').innerText = cart.length;
    }
}

function toggleUPI(show) {
    const upiSection = document.getElementById('upi-section');
    upiSection.style.display = show ? 'block' : 'none';
}

function openCheckoutModal(mode) {
    if (!currentUser) {
        showToast("Please login first to place an order!");
        openLogin(); 
        return; 
    }

    checkoutMode = mode;
    currentOrderTotal = 0;

    if (mode === 'single') {
        currentOrderTotal = currentProduct.price;
        document.getElementById('checkout-product-name').innerText = `1 Item - ₹${currentOrderTotal}`;
    } else {
        if(cart.length === 0) { showToast("Your cart is empty!"); return; }
        currentOrderTotal = cart.reduce((sum, item) => sum + item.price, 0);
        document.getElementById('checkout-product-name').innerText = `Cart Total (${cart.length} items) - ₹${currentOrderTotal}`;
    }
    
    document.getElementById('chk-name').value = currentUser.name;
    document.getElementById('chk-phone').value = currentUser.phone;
    
    document.getElementById('upi-amount').innerText = currentOrderTotal;
    const upiLink = `upi://pay?pa=${myUpiId}&pn=RS Fashion&am=${currentOrderTotal}&cu=INR&tn=Order Payment`;
    document.getElementById('upi-link').href = upiLink;

    document.querySelector('input[value="Cash on Delivery (COD)"]').checked = true;
    toggleUPI(false);

    document.getElementById('checkout-modal').style.display = 'flex';
}

function closeCheckout() { document.getElementById('checkout-modal').style.display = 'none'; }

document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('chk-name').value;
    const phone = document.getElementById('chk-phone').value;
    const address = `${document.getElementById('chk-add1').value}, ${document.getElementById('chk-add2').value}`;
    const pin = document.getElementById('chk-pin').value;
    
    const selectedPayMode = document.querySelector('input[name="pay_mode"]:checked').value;

    let msg = `*New Order Request!*\n\n`;
    
    msg += `*User ID:* ${currentUser.id}\n`;
    msg += `*Registered Name:* ${currentUser.name}\n\n`;
    
    msg += `*Items Ordered:*\n`;
    let finalTotal = 0;

    if(checkoutMode === 'single') {
        msg += `1. ${currentProduct.name} (ID: ${currentProduct.sku}) - ₹${currentProduct.price}\n`;
        finalTotal = currentProduct.price;
    } else {
        cart.forEach((item, i) => {
            msg += `${i+1}. ${item.name} (ID: ${item.sku}) - ₹${item.price}\n`;
            finalTotal += item.price;
        });
    }

    msg += `\n*Total Amount:* ₹${finalTotal}\n`;
    msg += `*Payment Mode:* ${selectedPayMode}\n\n`; 
    
    msg += `*Delivery Details:*\nName: ${name}\nMobile: ${phone}\nAddress: ${address}\nPincode: ${pin}\n\n`;
    msg += `*Order from the website*`;

    if (orderMethod === 'whatsapp') {
        window.open(`https://wa.me/${sellerWhatsAppNumber}?text=${encodeURIComponent(msg)}`, '_blank');
        closeCheckout();
        
        if(checkoutMode === 'cart') {
            cart = []; 
            saveCart(); // Clear local storage cart
            document.getElementById('cart-counter').innerText = 0;
        }
        this.reset();
        
    } else if (orderMethod === 'instagram') {
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = msg;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, 99999); 
        
        try {
            document.execCommand("copy");
            showToast("অর্ডারের ডিটেইলস কপি হয়েছে! Instagram-এ Paste করুন।"); 
            
            setTimeout(() => {
                window.open(`https://ig.me/m/${instagramUsername}`, '_blank');
                closeCheckout();
                
                if(checkoutMode === 'cart') {
                    cart = []; 
                    saveCart(); // Clear local storage cart
                    document.getElementById('cart-counter').innerText = 0;
                }
                document.getElementById('checkout-form').reset();
            }, 1500);
            
        } catch (err) {
            showToast("Copy failed on this browser. Please try WhatsApp.");
        }
        document.body.removeChild(tempTextArea);
    }
});
