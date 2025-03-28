document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "https://67e2030758cc6bf78527960a.mockapi.io/product";
    
    // ========================== ĐĂNG NHẬP ==========================
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            if (username === "admin" && password === "123456") {
                sessionStorage.setItem("user", JSON.stringify({ username: "admin", role: "admin" }));
                alert("Đăng nhập thành công! Đang chuyển hướng...");
                window.location.href = "admin.html";
            } else if (username === "user" && password === "123456") {
                sessionStorage.setItem("user", JSON.stringify({ username: "user", role: "user" }));
                alert("Đăng nhập thành công! Đang chuyển hướng...");
                window.location.href = "index.html";
            } else {
                alert("Sai tài khoản hoặc mật khẩu! Vui lòng thử lại.");
            }
        });
    }

    // ========================== CHẶN TRUY CẬP ADMIN ==========================
    let user = JSON.parse(sessionStorage.getItem("user"));
    if (window.location.pathname.includes("admin.html") && (!user || user.role !== "admin")) {
        alert("Bạn không có quyền truy cập vào trang quản trị!");
        window.location.href = "index.html";
    }

    // ========================== LẤY DỮ LIỆU SẢN PHẨM TỪ MOCKAPI ==========================
    async function fetchProducts() {
        try {
            let response = await fetch(API_URL);
            let products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
        }
    }

    function displayProducts(products) {
        const productContainer = document.getElementById("product-list");
        if (!productContainer) return;
        productContainer.innerHTML = "";
        products.forEach(product => {
            productContainer.innerHTML += `
                <div class="col-md-4">
                    <div class="card shadow-sm border-0">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body text-center">
                            <h5 class="card-title fw-bold">${product.name}</h5>
                            <p class="card-text text-danger fw-bold">Giá: ${product.price}đ</p>
                            <button class="btn btn-success w-100" onclick="addToCart('${product.name}', ${product.price})">Thêm vào giỏ</button>
                        </div>
                    </div>
                </div>`;
        });
    }

    // ========================== QUẢN LÝ GIỎ HÀNG ==========================
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    function renderCart() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = "";
        let total = 0;
        cart.forEach((item, index) => {
            let itemTotal = item.price * item.quantity;
            total += itemTotal;
            cartItemsContainer.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.price}đ</td>
                    <td><input type="number" value="${item.quantity}" min="1" class="form-control w-50 mx-auto" onchange="updateQuantity(${index}, this.value)"></td>
                    <td>${itemTotal}đ</td>
                    <td><button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Xóa</button></td>
                </tr>`;
        });
        totalPriceElement.textContent = total.toLocaleString();
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    window.addToCart = function (name, price) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }
    
        localStorage.setItem("cart", JSON.stringify(cart));
        alert("Đã thêm vào giỏ hàng!");
    };
    window.updateQuantity = function (index, quantity) {
        let newQuantity = parseInt(quantity);
        if (newQuantity > 0) {
            cart[index].quantity = newQuantity;
            renderCart();
        }
    };

    window.removeItem = function (index) {
        cart.splice(index, 1);
        renderCart();
    };

    document.getElementById("checkout")?.addEventListener("click", function () {
        if (cart.length === 0) {
            alert("Giỏ hàng của bạn đang trống!");
        } else {
            alert("Thanh toán thành công! Cảm ơn bạn đã mua hàng.");
            localStorage.removeItem("cart"); // Xóa giỏ hàng trong localStorage
            cart = []; // Đặt lại giỏ hàng
            renderCart(); // Cập nhật giao diện
        }
    });
    renderCart();
    fetchProducts();
});
document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartItemsContainer = document.getElementById("cart-items");
    const totalPriceElement = document.getElementById("total-price");

    function renderCart() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            let itemTotal = item.price * item.quantity;
            total += itemTotal;

            cartItemsContainer.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.price}đ</td>
                    <td>
                        <input type="number" value="${item.quantity}" min="1" class="form-control w-50 mx-auto"
                               onchange="updateQuantity(${index}, this.value)">
                    </td>
                    <td>${itemTotal}đ</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="removeItem(${index})">Xóa</button>
                    </td>
                </tr>`;
        });

        totalPriceElement.textContent = total.toLocaleString();
    }

    window.updateQuantity = function (index, quantity) {
        let newQuantity = parseInt(quantity);
        if (newQuantity > 0) {
            cart[index].quantity = newQuantity;
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCart();
        }
    };

    window.removeItem = function (index) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCart();
    };

    renderCart();
});
