window.addEventListener("DOMContentLoaded", () => {
    loadCartsAndProducts();
});

//Funcion para recuperar los carritos y productos dentro de los mismos:
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
        cartContainer.innerHTML = "";
        if (carts.length === 0) {
            return (cartContainer.innerHTML = "<p>Carts no founds.</p>");
        }
        for (const cid of carts) {
            opts = {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            };
            url = `/api/carts/${cid}`;
            res = await fetch(url, opts);
            res = await res.json();
            const cart = res.response;
            const isClosed = cart.close;
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
            cartTitle.textContent = `Cart ID: ${cid} ${isClosed ? "(CLOSED)" : ""}`;

            cartDiv.appendChild(cartTitle);
            const productList = document.createElement("ul");
            let totalCartPrice = 0;
            if (productsData.length === 0) {
                const emptyMsg = document.createElement("li");
                emptyMsg.textContent = "NaN Products in Cart";
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
                        ${!isClosed ? `
                        <div class="cart-column action-column">
                            <button class="btn-remove" data-cart="${cid}" data-product="${pid}"}>Delete</button>
                        </div>
                        `: ""}
                    `;
                    productList.appendChild(li);
                }
                const totalLi = document.createElement("li");
                totalLi.classList.add("cart-total");
                totalLi.innerHTML = `<strong>Total:</strong> $${totalCartPrice.toFixed(2)}`;
                productList.appendChild(totalLi);
            }
            cartDiv.appendChild(productList);
            //En caso de que no este cerrado el carrito:
            if (!isClosed) {
                const finalizeBtn = document.createElement("button");
                finalizeBtn.classList.add("btn-finalize");
                finalizeBtn.textContent = "Finish Cart";
                finalizeBtn.dataset.cart = cid;
                cartDiv.appendChild(finalizeBtn);
            }
            cartContainer.appendChild(cartDiv);
        };
        //En caso de que se quiere eliminar un producto de un carrito:
        document.querySelectorAll(".btn-remove").forEach(button => {
            button.addEventListener("click", async () => {
                const cartId = button.dataset.cart;
                const productId = button.dataset.product;
                await deleteProductInCart(cartId, productId, user);
            });
        });
        //En caso de que se quiere finalizar un carrito:
        document.querySelectorAll(".btn-finalize").forEach(button => {
            button.addEventListener("click", () => {
                const cid = button.dataset.cart;
                finalizeCart(cid);
            });
        });
    } catch (error) {
        console.log("Error al cargar los carritos y productos:", error);
    }
};

//Funcion para finalizar carrito:
async function finalizeCart(cid) {
    try {
        // Obtengo los productos del carrito:
        let url = `/api/carts/${cid}/products`;
        let opts = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        };
        let res = await fetch(url, opts);
        let cartProductsData = await res.json();
        const cartProducts = cartProductsData.response;
        const stockUpdates = [];
        //Verifico el stock de todos los productos:
        for (const item of cartProducts) {
            const pid = item.product;
            const quantityPurchased = item.quantity;
            //Obtengo los datos del producto:
            url = `/api/products/${pid}`;
            opts = {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            };
            const productDetailsRes = await fetch(url, opts);
            const productDetails = await productDetailsRes.json();
            const product = productDetails.response;
            const newStock = product.stock - quantityPurchased;
            if (newStock < 0) {
                alert(`Not enought of Stock of the Product: "${product.title}"!!!`);
                return; //Se cancela todo si algún producto no tiene stock
            }
            //Guardo en memoria para luego hacer las actualizaciones:
            stockUpdates.push({ pid, newStock });
        }
        //Actualizo el stock de todos los productos:
        for (const update of stockUpdates) {
            await updateStockProduct(update.pid, update.newStock);
        }
        //Cierro el carrito:
        opts = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ close: true })
        };
        url = `/api/carts/${cid}`;
        res = await fetch(url, opts);
        if (res.ok) {
            alert("Cart Finalized!");
            loadCartsAndProducts();
        } else {
            alert("Error: Couldn't finalize the Cart!");
        }
    } catch (error) {
        console.log("Error:", error);
    }
};

//Funcion para actualizar la cantidad de cada producto cuando se finaliza el carrito:
async function updateStockProduct(pid, quantity) {
    try {
        const opts = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stock: quantity })
        }
        const url = `/api/products/${pid}`;
        const res = await fetch(url, opts);
        if (!res.ok) { alert("The stock of the product has not been updated!"); }
    } catch (error) {
        console.log(error);
    }
};

async function deleteProductInCart(cid, pid, user) {
    try {
        let opts = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        let url = `/api/carts/${cid}`;
        let res = await fetch(url, opts);
        let cartData = await res.json();
        let cart = cartData.response;
        let products = cart.products;
        const updatedProducts = products.filter(prod => prod.product !== pid);
        //En caso de que el carrito se quede sin productos:
        if (updatedProducts.length === 0) {
            const updateCarts = user.cart.filter(c => c !== cid);
            //Actualizo la referencia de carrito dentro del usuario:
            opts = {
                method: "PUT",  
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cart: updateCarts }) 
            };
            let uid = user._id;
            url = `/api/users/${uid}`;
            res = await fetch(url, opts);   
            if (!res.ok) { alert("Error: Couldn't update the cart of the user!"); }
            //Elimino el carrito:
            opts = {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },    
            }
            url = `/api/carts/${cid}`;  
            res = await fetch(url, opts);
            if (!res.ok) { alert("Error: Couldn't delete the cart!"); }
            else { 
                alert("Cart has been deleted!"); 
                window.location.reload();
            }
        } else { //En caso de que haya mas productos:
            url = `/api/carts/${cid}`;
            opts = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ products: updatedProducts })
            };
            res = await fetch(url, opts);
            const updateRes = await res.json();
            if (!updateRes.response) {
                alert("Error: The Product wasn't eliminated from the Cart!!");
            } else {
                alert("The Product has been eliminated!!!");
                window.location.reload();
            }
        }
    } catch (error) {
        console.log(error);
    }
}