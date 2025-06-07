window.addEventListener("DOMContentLoaded", () => {
    loadCartsAndProducts();
});

async function loadCartsAndProducts() {
    try {
        let opts = {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        };
        let url = "/api/auth/current";
        let res = await fetch(url, opts);
        res = await res.json();
        const user = res.response;
        const uid = user._id;
        //Traigo los carritos del usuario_
        opts = { method: "GET", headers: { "Content-Type": "application/json" } };
        url = `/api/users/${uid}/carts`;
        res = await fetch(url, opts);
        res = await res.json();
        const carts = res.response;
        const cartContainer = document.getElementById("cartContainer");
        cartContainer.innerHTML = "";
        if (carts.length === 0) { return (cartContainer.innerHTML = "<p>No carts found.</p>"); }
        for (const cid of carts) {
            //Datos del carrito:
            url = `/api/carts/${cid}`;
            res = await fetch(url, opts);
            res = await res.json();
            const cart = res.response;
            const isClosed = cart.close;
            //Productos del carrito:
            url = `/api/carts/${cid}/products`;
            res = await fetch(url, opts);
            let productsData = await res.json();
            productsData = productsData.response;
            const cartDiv = document.createElement("div");
            cartDiv.classList.add("cart");
            const cartTitle = document.createElement("h3");
            cartTitle.textContent = `Cart ID: ${cid} ${isClosed ? "(CLOSED)" : ""}`;
            cartDiv.appendChild(cartTitle);
            const productList = document.createElement("ul");
            let totalCartPrice = 0;
            if (productsData.length === 0) {
                const emptyMsg = document.createElement("li");
                emptyMsg.textContent = "No products in this cart.";
                productList.appendChild(emptyMsg);
            } else {
                for (const item of productsData) {
                    const pid = item.product;
                    const quantity = item.quantity;
                    url = `/api/products/${pid}`;
                    res = await fetch(url, opts);
                    const productDetails = await res.json();
                    const product = productDetails.response;
                    const total = product.price * quantity;
                    totalCartPrice += total;
                    const li = document.createElement("li");
                    li.classList.add("cart-item");
                    li.innerHTML = `
                        <div class="cart-column image-column">
                            <img src="${product.image}" alt="${product.title}" class="product-image" />
                        </div>
                        <div class="cart-column details-column">
                            <span><strong>Producto:</strong> ${product.title}</span><br/>
                            <span><strong>Cantidad:</strong> ${quantity}</span><br/>
                            <span><strong>Precio:</strong> $${product.price}</span><br/>
                            <span><strong>Total:</strong> $${total.toFixed(2)}</span>
                        </div>
                        ${!isClosed ? `
                        <div class="cart-column action-column">
                            <button class="btn-remove" data-cart="${cid}" data-product="${pid}">Delete</button>
                        </div>
                        ` : ""}
                    `;
                    productList.appendChild(li);
                }
                const totalLi = document.createElement("li");
                totalLi.classList.add("cart-total");
                totalLi.innerHTML = `<strong>Total:</strong> $${totalCartPrice.toFixed(2)}`;
                productList.appendChild(totalLi);
            }
            cartDiv.appendChild(productList);
            if (!isClosed) {
                const finalizeBtn = document.createElement("button");
                finalizeBtn.classList.add("btn-finalize");
                finalizeBtn.className = "btn btn-outline-success btn-finalize";
                finalizeBtn.textContent = "Finish Cart";
                finalizeBtn.dataset.cart = cid;
                cartDiv.appendChild(finalizeBtn);
            }
            cartContainer.appendChild(cartDiv);
        }
        //Evento para eliminar producto del carrito:
        document.querySelectorAll(".btn-remove").forEach(button => {
            button.addEventListener("click", async () => {
                const cartId = button.dataset.cart;
                const productId = button.dataset.product;
                await deleteProductInCart(cartId, productId, user);
            });
        });
        //Evento para finalizar carrito:
        document.querySelectorAll(".btn-finalize").forEach(button => {
            button.addEventListener("click", () => {
                const cid = button.dataset.cart;
                finalizeCart(cid);
            });
        });
    } catch (error) {
        console.log("Error loading carts and products:", error);
    }
};

async function finalizeCart(cid) {
    try {
        const url = `/api/carts/finalize/${cid}`;
        const opts = {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        };
        const res = await fetch(url, opts);
        const result = await res.json();
        if (res.ok) {
            alert("Cart finalized successfully!");
            loadCartsAndProducts();
        } else {
            alert("Error finalizing cart: " + result.message);
        }
    } catch (error) {
        console.log("Error:", error);
    }
}

async function deleteProductInCart(cid, pid, user) {
    try {
        let url = `/api/carts/${cid}`;
        let res = await fetch(url, { method: "GET", headers: { "Content-Type": "application/json" } });
        let cart = (await res.json()).response;
        let products = cart.products;
        const updatedProducts = products.filter(prod => prod.product !== pid);
        if (updatedProducts.length === 0) {
            //Actualizo el usuario para eliminar la ref. al carrito vacío:
            const updateCarts = user.cart.filter(c => c !== cid);
            let opts = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart: updateCarts })
            };
            let uid = user._id;
            url = `/api/users/${uid}`;
            res = await fetch(url, opts);
            if (!res.ok) alert("Failed to update user carts");
            // Elimino el carrito vacío
            opts = { method: "DELETE", headers: { "Content-Type": "application/json" } };
            url = `/api/carts/${cid}`;
            res = await fetch(url, opts);
            if (res.ok) {
                alert("Cart deleted.");
                window.location.reload();
            } else {
                alert("Error deleting cart");
            }
        } else {
            //Actualizo el carrito sin ese producto:
            const opts = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ products: updatedProducts })
            };
            url = `/api/carts/${cid}`;
            res = await fetch(url, opts);
            const updateRes = await res.json();
            if (!updateRes.response) {
                alert("Product could not be removed!");
            } else {
                alert("Product removed from cart.");
                window.location.reload();
            }
        }
    } catch (error) {
        console.log(error);
    }
}