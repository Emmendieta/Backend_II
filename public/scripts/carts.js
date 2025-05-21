/* window.addEventListener("DOMContentLoaded", async () => {
    try {
        // Verifico que el usuario esté logueado:
        let opts = {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        };
        let url = "/api/auth/current";
        let res = await fetch(url, opts);
        res = await res.json();
        const uid = res.response._id;
        // Traigo los carritos del usuario
        opts = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        url = `/api/users/${uid}/carts`;
        res = await fetch(url, opts);
        res = await res.json();
        const carts = res.response;
        const cartContainer = document.getElementById("cartContainer");
        if (carts.length === 0) {
            return cartContainer.innerHTML = "<p>No hay carritos disponibles.</p>";
        }
        for (const cid of carts) {
            // Traigo los productos del carrito
            const productUrl = `/api/carts/${cid}/products`;
            opts = {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            };
            const productRes = await fetch(productUrl, opts);
            let productsData = await productRes.json();
            productsData = productsData.response;
            // Creo el HTML dinámicamente
            const cartDiv = document.createElement("div");
            cartDiv.classList.add("cart");

            const cartTitle = document.createElement("h3");
            cartTitle.textContent = `Cart ID: ${cid}`;
            cartDiv.appendChild(cartTitle);
            const productList = document.createElement("ul");

            if (productsData.length === 0) {
                const emptyMsg = document.createElement("li");
                emptyMsg.textContent = "Este carrito no tiene productos.";
                productList.appendChild(emptyMsg);
            } else {
                for (const prod of productsData) {
                    const pid = prod.product;
                    const quantity = prod.quantity;
                    url = `/api/products/${pid}`;
                    opts = {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    };
                    //Obtengo los detalles de cada producto:
                    const productDetailsRes = await fetch(url, opts);
                    const productDetails = await productDetailsRes.json();
                    const produ = productDetails.response;
                    //Creo el Html con los detalles de cada producto:
                    const li = document.createElement("li");
                    li.innerHTML = `
                        <div class="productsUlLiDiv">
                            <img src="${produ.image}" class="card-img-top object-fit-cover" alt="${prod._id}" />
                        </div>
                        <div class="productsUlLiDiv">
                            <h3 class="productsUlLih3">Title: </h3>
                            <h3 class="card-textv productsUlLih3">${produ.title}</h3>
                        </div>
                        <div class="productsUlLiDiv">
                            <h3 class="productsUlLih3">$ </h3>
                            <h3 class="card-textv productsUlLih3">${produ.price}</h3>
                        </div>
                        <div class="productsUlLiDiv">
                            <h3 class="productsUlLih3">Code: </h3>
                            <h3 class="card-textv productsUlLih3">${produ.code}</h3>
                        </div>
                        <div class="productsUlLiDiv">
                            <h3 class="productsUlLih3">Quantity: </h3>
                            <h3 class="card-textv productsUlLih3">${quantity}</h3>
                        </div>                    
                    `;
                    productList.appendChild(li);
                }
            }
            cartDiv.appendChild(productList);
            cartContainer.appendChild(cartDiv);
        }
    } catch (error) {
        console.log("Error al cargar los carritos y productos:", error);
    }
});
 */

window.addEventListener("DOMContentLoaded", async () => {
    try {
        let opts = {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        };
        let url = "/api/auth/current";
        let res = await fetch(url, opts);
        res = await res.json();
        const uid = res.response._id;

        opts = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        url = `/api/users/${uid}/carts`;
        res = await fetch(url, opts);
        res = await res.json();
        const carts = res.response;

        const cartContainer = document.getElementById("cartContainer");

        if (carts.length === 0) {
            return (cartContainer.innerHTML = "<p>No hay carritos disponibles.</p>");
        }

        for (const cid of carts) {
            const productUrl = `/api/carts/${cid}/products`;
            opts = {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            };
            const productRes = await fetch(productUrl, opts);
            let productsData = await productRes.json();
            productsData = productsData.response;

            const cartDiv = document.createElement("div");
            cartDiv.classList.add("cart");

            const cartTitle = document.createElement("h3");
            cartTitle.textContent = `Cart ID: ${cid}`;
            cartDiv.appendChild(cartTitle);

            const productList = document.createElement("ul");
            let totalCartPrice = 0;

            if (productsData.length === 0) {
                const emptyMsg = document.createElement("li");
                emptyMsg.textContent = "Este carrito no tiene productos.";
                productList.appendChild(emptyMsg);
            } else {
                for (const item of productsData) {
                    const pid = item.product;
                    const quantity = item.quantity;
                    url = `/api/products/${pid}`;
                    opts = {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    };

                    const productDetailsRes = await fetch(url, opts);
                    const productDetails = await productDetailsRes.json();
                    const product = productDetails.response;

                    const total = product.price * quantity;
                    totalCartPrice += total;

                    const li = document.createElement("li");
                    li.classList.add("cart-item");
                    /*                     li.innerHTML = `
                                <img src="${product.image}" alt="${product._id}" class="product-image" />
                                <span><strong>Producto:</strong> ${product.title}</span>
                                <span><strong>Cantidad:</strong> ${quantity}</span>
                                <span><strong>Precio:</strong> $${product.price}</span>
                                <span><strong>Total:</strong> $${total.toFixed(2)}</span>
                                <button class="btn-remove" data-cart="${cid}" data-product="${pid}">Eliminar</button>
                                `; */
                    li.innerHTML = `
                        <div class="cart-column image-column">
                            <img src="${product.image}" alt="${product._id}" class="product-image" />
                        </div>
                        <div class="cart-column details-column">
                            <span><strong>Producto:</strong> ${product.title}</span><br/>
                            <span><strong>Cantidad:</strong> ${quantity}</span><br/>
                            <span><strong>Precio:</strong> $${product.price}</span><br/>
                            <span><strong>Total:</strong> $${total.toFixed(2)}</span>
                        </div>
                        <div class="cart-column action-column">
                            <button class="btn-remove" data-cart="${cid}" data-product="${pid}">Eliminar</button>
                        </div>
                    `;

                    productList.appendChild(li);
                }

                const totalLi = document.createElement("li");
                totalLi.classList.add("cart-total");
                totalLi.innerHTML = `<strong>Total del carrito:</strong> $${totalCartPrice.toFixed(2)}`;
                productList.appendChild(totalLi);
            }

            cartDiv.appendChild(productList);
            cartContainer.appendChild(cartDiv);
        }

        document.querySelectorAll(".btn-remove").forEach(button => {
            button.addEventListener("click", async () => {
                const cartId = button.dataset.cart;
                const productId = button.dataset.product;

                const res = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                });

                if (res.ok) {
                    alert("Producto eliminado del carrito");
                    window.location.reload();
                } else {
                    alert("Error al eliminar el producto");
                }
            });
        });
    } catch (error) {
        console.log("Error al cargar los carritos y productos:", error);
    }
});
