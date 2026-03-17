// Product Database
const products = [
    { id: 1, sku: 'Rs01K', name: 'Premium Chiffon Hijab', price: 1299, img: 'prod1.jpg' },
    { id: 2, sku: 'Rs02K', name: 'Elegant Black Abaya', price: 1299, img: 'prod2.jpg' },
    { id: 3, sku: 'Rs03K', name: 'Everyday Cotton Hijab', price: 1499, img: 'prod3.jpg' },
    { id: 4, sku: 'Rs04K', name: 'Premium Jersey Hijab', price: 1299, img: 'prod4.jpg' },
    { id: 8, sku: 'Rs01J', name: 'new Chiffon Hijab', price: 1299, img: 'prod2.jpg' }, // Changed ID to 8 to avoid duplicate ID 1
    { id: 5, sku: 'Rs05K', name: 'Elegant Black Abaya', price: 1399, img: 'cat4.jpg' },
    { id: 6, sku: 'Rs06K', name: 'Cotton Hijab', price: 180, img: 'prod5.jpg' },
    { id: 7, sku: 'Rs07K', name: 'Jersey Hijab', price: 1299, img: 'cat3.jpg' }
];

let cart = [];
let currentProduct = null;
let currentUser = null;
let checkoutMode = 'single'; 
let orderMethod = 'whatsapp'; // Tracks which button was clicked (WhatsApp or Instagram)

const sellerWhatsAppNumber = '919876543210'; 
const instagramUsername = 'rs__fashion____009'; // Client's IG username

window.onload = () => {
    renderProducts();
    startAutoSlide();
};

function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 3000);
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
                    <div><div style="font-weight: 500;">${p.name}</div><div style="color: #c5a880; font-size: 12px;">ID: ${p.sku} | ₹${p.price}</div></div>
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

function addToCartFromDetail() {
    cart.push(currentProduct);
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
                    <div style="flex-grow: 1;"><p style="font-size: 11px; color: #888;">ID: ${item.sku}</p><h4>${item.name}</h4><p style="color: #c5a880; font-weight: bold;">₹${item.price}</p></div>
                    <i class="fas fa-trash" style="color: red; cursor: pointer; padding: 10px;" onclick="removeFromCart(${index})"></i>
                </div>
            `;
        });
    }
    document.getElementById('cart-total').innerText = `Total: ₹${total}`;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    document.getElementById('cart-counter').innerText = cart.length;
    renderCart();
}

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
        document.getElementById('sidebar-user-display').innerHTML = `Logged in as: <b>${name}</b><br>ID: <span style="color: #c5a880">${uniqueId}</span>`;
        document.getElementById('prof-name').innerText = name;
        document.getElementById('prof-phone').innerText = phone;
        document.getElementById('prof-id').innerText = uniqueId;
        closeLogin();
        navigate('profile-view');
        showToast("Successfully logged in!");
    } else { showToast("Please enter both Name and Number."); }
}

function logoutUser() {
    currentUser = null;
    document.getElementById('sidebar-user-display').innerText = "Not Logged In";
    document.getElementById('login-name').value = '';
    document.getElementById('login-number').value = '';
    navigate('home-view');
    showToast("Logged out successfully.");
}

function openCheckoutModal(mode) {
    checkoutMode = mode;
    if (mode === 'single') {
        document.getElementById('checkout-product-name').innerText = `1 Item - ₹${currentProduct.price}`;
    } else {
        if(cart.length === 0) { showToast("Your cart is empty!"); return; }
        let total = cart.reduce((sum, item) => sum + item.price, 0);
        document.getElementById('checkout-product-name').innerText = `Cart Total (${cart.length} items) - ₹${total}`;
    }
    document.getElementById('checkout-modal').style.display = 'flex';
}

function closeCheckout() { document.getElementById('checkout-modal').style.display = 'none'; }

document.getElementById('checkout-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('chk-name').value;
    const phone = document.getElementById('chk-phone').value;
    const address = `${document.getElementById('chk-add1').value}, ${document.getElementById('chk-add2').value}`;
    const pin = document.getElementById('chk-pin').value;

    let msg = `*New Order Request!*\n\n`;
    if(currentUser) msg += `*User ID:* ${currentUser.id}\n`;
    
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

    msg += `\n*Total Amount:* ₹${finalTotal}\n\n`;
    msg += `*Customer Details:*\nName: ${name}\nMobile: ${phone}\nAddress: ${address}\nPincode: ${pin}\n\n`;
    msg += `_COD Available_\n*Order from the website*`;

    // Check which button was clicked
    if (orderMethod === 'whatsapp') {
        window.open(`https://wa.me/${sellerWhatsAppNumber}?text=${encodeURIComponent(msg)}`, '_blank');
        closeCheckout();
        
        if(checkoutMode === 'cart') {
            cart = []; 
            document.getElementById('cart-counter').innerText = 0;
        }
        this.reset();
        
    } else if (orderMethod === 'instagram') {
        // BULLETPROOF MOBILE COPY FALLBACK
        const tempTextArea = document.createElement("textarea");
        tempTextArea.value = msg;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        tempTextArea.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            document.execCommand("copy");
            showToast("অর্ডারের ডিটেইলস কপি হয়েছে! Instagram-এ Paste করুন।"); 
            
            setTimeout(() => {
                window.open(`https://ig.me/m/${instagramUsername}`, '_blank');
                closeCheckout();
                
                if(checkoutMode === 'cart') {
                    cart = []; 
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
