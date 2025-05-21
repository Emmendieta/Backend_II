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
                    let opts = {
                        method: "POST",
                        headers: { "Content-Type": "application/json" }
                    };
                    let url = "/api/auth/current";
                    let response = await fetch(url, opts);
                    const user = await response.json();
                    if (!user) { return alert("You must Login to add the product to the cart!"); }
                    else {
                        const userId = user.response._id;
                        let carts = user.response.cart;
                        opts = {
                            method: "GET",
                            headers: { "Content-Type": "application/json" }
                        };
                        url = `/api/users/${userId}/cart`;
                        response = await fetch(url, opts);
                        //En caso de que el usuario no tenga ningun carrito o que no haya carrito sin cerrar:
                        if (!response.ok || carts.length === 0) {
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
                            url = `/api/users/${userId}/cart`;
                            response = await fetch(url, opts);
                            response = await response.json();
                            if (!response.response) {
                                alert("Error: The Cart has not been asociate to the User!");
                                return;
                            }
                            alert("The Cart created success!");
                        } else {
                            //En caso de que tenga un carrito sin cerrar:
                            let cid = await response.json();
                            cid = cid.response;
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
                            console.log(products);
                        }

                    }

                }
            }
        }
    } catch (error) {

    }
});