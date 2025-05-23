const btnAddToCart = document.getElementById("btnAddProductToCart");

btnAddToCart.addEventListener("click", async () => {
    try {
        let quantity = document.getElementById("detailsUlLiDivBottomQuantityInput").value;
        let stock = document.getElementById("productStock").innerText;
        const productId = document.getElementById("productId").innerText;
        quantity = Number(quantity);
        stock = Number(stock);
        if (isNaN(quantity) || isNaN(stock)) {
            alert("Invalid quantity or stock!");
            return;
        } else {
            if (quantity > stock) {
                alert("Quantity exceeds stock!");
                return;
            } else {
                if (quantity <= 0) {
                    alert("Quantity must be greater than 0!");
                    return;
                } else {
                    //Recupero la info del usuario:
                    let opts = {
                        method: "POST",
                        headers: { "Content-Type": "application/json" }
                    };
                    let url = "/api/auth/current";
                    let response = await fetch(url, opts);
                    let user = await response.json();
                    if (!user) { return alert("You must Login to add the product to the cart!"); }
                    else {
                        let uid = user.response._id;
                        let carts = user.response.cart;
                        let res = [];
                        let resp = [];
                        if (carts.length !== 0) {
                            opts = {
                                method: "GET",
                                headers: { "Content-Type": "application/json" }
                            };
                            url = `/api/users/${uid}/cart`;
                            resp = await fetch(url, opts);
                            res = await resp.json();
                            res = res.response;
                        }
                        //En caso de que el usuario no tenga ningun carrito o que no haya carrito sin cerrar:
                        if ((res.length === 0) || !resp.ok || carts.length === 0) {
                            let body = {
                                products: [
                                    {
                                        product: productId,
                                        quantity: quantity
                                    }
                                ]
                            };
                            opts = {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(body)
                            };
                            url = "/api/carts";
                            response = await fetch(url, opts);
                            response = await response.json();
                            const cartId = response.response._id;
                            //Asocio el Carrito al usuario:
                            body = {
                                cartId: cartId
                            };
                            opts = {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(body)
                            };
                            url = `/api/users/${uid}/cart`;
                            response = await fetch(url, opts);
                            res = await response.json();
                            if (!res.response) {
                                alert("Error: The Cart has not been asociate to the User!");
                                return;
                            }
                            alert("The Cart created success and has been added the Product required!");
                        } else {
                            //En caso de que tenga un carrito sin cerrar:
                            let cid = res._id;
                            opts = {
                                method: "GET",
                                headers: { "Content-Type": "application/json" },
                                params: cid
                            };
                            url = `/api/carts/${cid}`;
                            response = await fetch(url, opts);
                            cart = await response.json();
                            cart = cart.response;
                            const products = cart.products;
                            const productInCart = products.find(prod => prod.product === productId);
                            if (productInCart) {
                                //En Caso de que el producto exista en el carrito actualizo la cantidad:
                                let quantityInCart = productInCart.quantity;
                                quantityInCart = Number(quantityInCart);
                                //Verifico que la cantidad no sea la misma:
                                if (quantityInCart === quantity) {
                                    alert("The quantity is the same!");
                                } else {
                                    //Actualizo la cantidad del producto en el carrito:
                                    const updatedPorducts = products.map(prod => {
                                        if (prod.product === productId) { return { ...prod, quantity: quantity }; }
                                        return prod;
                                    })
                                    opts = {
                                        method: "PUT",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ products: updatedPorducts }),
                                    };
                                    //Actualizo los datos del carrito:
                                    url = `/api/carts/${cid}`;
                                    response = await fetch(url, opts);
                                    return alert("Product quantity updated!");
                                }
                            } else {
                                const newProduct = {
                                    product: productId,
                                    quantity: quantity
                                };
                                const updateProducts = [...products, newProduct];
                                opts = {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ products: updateProducts }),
                                };
                                url = `/api/carts/${cid}`;
                                response = await fetch(url, opts);
                                response = await response.json();
                                if (!response.response) { return alert("Error: Error adding new product to cart!"); }
                                else { return alert("New Product added to the Cart!!"); }
                            }
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
});